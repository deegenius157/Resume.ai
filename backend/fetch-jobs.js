const path = require('path');
const crypto = require('crypto');
const Parser = require('rss-parser');
const { createClient } = require('@supabase/supabase-js');

// Polyfill WebSocket for Node.js compatibility (Node v20)
if (!global.WebSocket) {
  try {
    global.WebSocket = require('ws');
  } catch (e) {
    console.warn('⚠️ Warning: ws module not found. WebSocket polyfill skipped.');
  }
}

// 1. Load environment variables from .env.local if present
require('dotenv').config({ path: path.resolve(__dirname, '../.env.local') });
require('dotenv').config({ path: path.resolve(__dirname, '../../.env.local') });

const SUPABASE_URL = process.env.SUPABASE_URL || 'https://tkbibprszkrwgtmnexaz.supabase.co';
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_KEY || 'sb_publishable_QhnNbsU439dTjRHdaIpjBw_LqYPMBHH';

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY, {
  auth: { persistSession: false }
});

const parser = new Parser();

// Helper to clean up Mojibake encoding corruption
function cleanCorruptedText(text) {
  if (!text) return '';
  return text
    .replace(/â€”/g, '—')
    .replace(/â\x80\x94/g, '—')
    .replace(/â€™/g, "'")
    .replace(/â\x80\x99/g, "'")
    .replace(/â\x80\x98/g, "'")
    .replace(/â\x82\xa6/g, '₦')
    .replace(/â‚¦/g, '₦')
    .replace(/â\x80\x9c/g, '"')
    .replace(/â\x80\x9d/g, '"')
    .replace(/â\x80\xa2/g, '•');
}

// Helper to split description, requirements, and benefits
function parseDescription(rawDesc) {
  if (!rawDesc) return { description: '', requirements: '', benefits: '' };
  
  // Clean up whitespace and carriage returns
  const cleanText = rawDesc.replace(/\r\n/g, '\n').replace(/\r/g, '\n').trim();
  
  // Define split keywords
  const splitKeywords = [
    'requirement', 'requirements', 
    'qualification', 'qualifications', 
    'expectations', 'requirement:', 
    'requirements:', 'qualification:', 
    'qualifications:', 'key requirements'
  ];
  
  let splitIndex = -1;
  let matchedKeyword = '';
  
  for (const keyword of splitKeywords) {
    const idx = cleanText.toLowerCase().indexOf('\n' + keyword);
    if (idx !== -1) {
      if (splitIndex === -1 || idx < splitIndex) {
        splitIndex = idx;
        matchedKeyword = keyword;
      }
    }
    const idxDirect = cleanText.toLowerCase().indexOf(keyword);
    if (idxDirect === 0) {
      splitIndex = 0;
      matchedKeyword = keyword;
    }
  }
  
  let description = cleanText;
  let requirements = 'Relevant qualifications and experience are required for this role.';
  let benefits = 'Discussed during the interview stage.';
  
  if (splitIndex !== -1) {
    description = cleanText.substring(0, splitIndex).trim();
    requirements = cleanText.substring(splitIndex).replace(new RegExp(`^${matchedKeyword}:?\\s*`, 'i'), '').trim();
  }
  
  // Try to find benefits keyword in description or requirements
  const benefitsKeywords = ['benefits', 'what we offer', 'remuneration', 'offer', 'compensation'];
  for (const bKeyword of benefitsKeywords) {
    const bIdx = requirements.toLowerCase().indexOf('\n' + bKeyword);
    if (bIdx !== -1) {
      benefits = requirements.substring(bIdx).replace(new RegExp(`^\\n*${bKeyword}:?\\s*`, 'i'), '').trim();
      requirements = requirements.substring(0, bIdx).trim();
      break;
    }
  }
  
  return { description, requirements, benefits };
}

// Helper to fetch wrapper page and extract email/apply link + deadline date
async function extractSourceUrlAndDeadline(wrapperUrl) {
  let sourceUrl = wrapperUrl;
  let deadline = null;
  
  try {
    const res = await fetch(wrapperUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      }
    });
    if (!res.ok) throw new Error(`Status ${res.status}`);
    const arrayBuffer = await res.arrayBuffer();
    const decoder = new TextDecoder('utf-8');
    const html = decoder.decode(arrayBuffer);
    
    // 1. Extract deadline from json-ld (validThrough)
    const validThroughMatch = html.match(/"validThrough":\s*"([^"]+)"/i);
    if (validThroughMatch) {
      deadline = validThroughMatch[1].split('T')[0]; // YYYY-MM-DD
    } else {
      // Try regex for Deadline: ...
      const deadlineMatch = html.match(/Deadline:<\/b>\s*([^<]+)/i);
      if (deadlineMatch) {
        const dlText = deadlineMatch[1].trim();
        if (dlText.toLowerCase() !== 'not specified' && dlText.toLowerCase() !== 'not-specified') {
          const parsedDate = new Date(dlText);
          if (!isNaN(parsedDate.getTime())) {
            deadline = parsedDate.toISOString().split('T')[0];
          }
        }
      }
    }
    
    // 2. Extract source_url (email or external apply link)
    const methodIndex = html.toLowerCase().indexOf('method of application');
    if (methodIndex !== -1) {
      const methodHtml = html.substring(methodIndex, methodIndex + 2000);
      
      const emailMatch = methodHtml.match(/[\w.-]+@[\w.-]+\.[\w]+/i);
      if (emailMatch) {
        sourceUrl = `mailto:${emailMatch[0]}`;
      } else {
        const hrefMatches = methodHtml.match(/href="([^"]+)"/g) || [];
        for (const m of hrefMatches) {
          const href = m.match(/href="([^"]+)"/)[1];
          if (href.startsWith('http') && !href.includes('myjobmag.com') && !href.includes('facebook') && !href.includes('twitter') && !href.includes('linkedin')) {
            sourceUrl = href;
            break;
          }
        }
      }
    }
  } catch (err) {
    console.warn(`⚠️ Failed to parse wrapper page details for ${wrapperUrl}:`, err.message);
  }
  
  if (!deadline) {
    const defaultDate = new Date();
    defaultDate.setDate(defaultDate.getDate() + 30);
    deadline = defaultDate.toISOString().split('T')[0];
  }
  
  return { sourceUrl, deadline };
}

async function fetchAndUpsertJobs() {
  console.log('🔄 Initiating MyJobMag detailed RSS fetch process for ICT & Technology roles...');
  const feedUrl = 'https://www.myjobmag.com/jobsxml_by_categories.xml?cat=ict-computer';
  
  try {
    const res = await fetch(feedUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      }
    });
    if (!res.ok) throw new Error(`Feed fetch status ${res.status}`);
    const xmlBuffer = await res.arrayBuffer();
    const decoder = new TextDecoder('utf-8');
    const xmlString = decoder.decode(xmlBuffer);
    const feed = await parser.parseString(xmlString);
    const rawItems = feed.items || [];
    console.log(`✅ Successfully fetched ${rawItems.length} raw jobs from MyJobMag.`);
    
    if (rawItems.length === 0) {
      console.log('No jobs found in feed.');
      return;
    }
    
    // Limit to first 25 items to run quickly, respect rate limits, and avoid execution timeouts
    const itemsToProcess = rawItems.slice(0, 25);
    console.log(`📡 Scraping application endpoints and deadlines for ${itemsToProcess.length} jobs...`);
    
    const mappedJobs = [];
    for (let i = 0; i < itemsToProcess.length; i++) {
      const item = itemsToProcess[i];
      console.log(`⏳ Processing [${i+1}/${itemsToProcess.length}]: ${item.title}`);
      
      const job_id = crypto.createHash('md5').update(item.link).digest('hex');
      const { description, requirements, benefits } = parseDescription(item.description || item.content);
      let { sourceUrl, deadline } = await extractSourceUrlAndDeadline(item.link);
      
      if (sourceUrl) {
        sourceUrl = sourceUrl.trim();
        if (!sourceUrl.startsWith('mailto:') && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(sourceUrl)) {
          sourceUrl = `mailto:${sourceUrl}`;
        }
      }
      
      mappedJobs.push({
        job_id,
        title: cleanCorruptedText(item.title),
        company: cleanCorruptedText(item.company || 'Hiring Company'),
        location: cleanCorruptedText(item.location || 'Remote'),
        description: cleanCorruptedText(description),
        requirements: cleanCorruptedText(requirements),
        benefits: cleanCorruptedText(benefits),
        deadline,
        source_url: sourceUrl,
        category: item.categories?.join(', ') || 'Technology',
        url: item.link, // Keep original url just in case
        created_at: item.pubDate ? new Date(item.pubDate).toISOString() : new Date().toISOString()
      });
      
      // Delay briefly to be polite
      await new Promise(resolve => setTimeout(resolve, 300));
    }
    
    // Local deduplication
    const uniqueJobsMap = new Map();
    for (const job of mappedJobs) {
      uniqueJobsMap.set(job.job_id, job);
    }
    const uniqueMappedJobs = Array.from(uniqueJobsMap.values());
    console.log(`✨ Deduplicated: ${uniqueMappedJobs.length} unique jobs ready to upsert.`);
    
    console.log('⚡ Upserting jobs into Supabase...');
    const { data, error } = await supabase
      .from('jobs')
      .upsert(uniqueMappedJobs, { onConflict: 'job_id', ignoreDuplicates: true });
      
    if (error) {
      throw error;
    }
    
    console.log('🎉 Successfully completed job sync process. Duplicate entries were skipped.');
  } catch (error) {
    console.error('❌ Error executing job sync:', error.message);
    process.exit(1);
  }
}

fetchAndUpsertJobs();
