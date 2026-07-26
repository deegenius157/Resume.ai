const fs = require('fs');
const path = require('path');
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
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_KEY) {
  console.error('❌ Error: SUPABASE_SERVICE_ROLE_KEY is not defined.');
  process.exit(1);
}


const supabase = createClient(SUPABASE_URL, SUPABASE_KEY, {
  auth: { persistSession: false }
});


const parser = new Parser({
  customFields: {
    item: [
      ['company', 'company'],
      ['company_name', 'company_name'],
      ['dc:creator', 'creator'],
      ['author', 'author'],
      ['source', 'source'],
      ['job_type', 'job_type'],
      ['employment_type', 'employment_type'],
      ['location', 'location'],
      ['tags', 'tags']
    ]
  }
});

function extractCompanyName(item) {
  if (!item) return null;
  let company = item.company || item.company_name || item.creator || item.author || item.source;
  if (!company) return null;
  if (typeof company === 'object') {
    company = company.name || company._ || company.content || '';
  }
  company = String(company).trim();
  if (!company || company.toLowerCase() === 'hiring company' || company.toLowerCase() === 'unknown') {
    return null;
  }
  return company;
}

function extractLocationName(item) {
  if (!item) return null;
  let loc = item.location || item.job_location || item['dc:location'];
  if (!loc) return null;
  if (typeof loc === 'object') {
    loc = loc.name || loc._ || loc.content || '';
  }
  loc = String(loc).trim();
  if (!loc || loc.toLowerCase() === 'n/a') return null;
  return loc;
}

function extractJobType(item) {
  if (!item) return null;
  let type = item.job_type || item.employment_type || item.type;
  if (!type) return null;
  if (typeof type === 'object') {
    type = type.name || type._ || type.content || '';
  }
  type = String(type).trim();
  if (!type || type.toLowerCase() === 'n/a') return null;
  return type;
}

function sanitizeApplicationUrl(rawUrl) {
  if (!rawUrl || typeof rawUrl !== 'string') return '';
  let url = rawUrl.trim();
  url = url.replace(/[\>\"\'\`\)]+$/, '');

  if (!url.startsWith('mailto:') && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(url)) {
    return `mailto:${url}`;
  }

  if (url.startsWith('mailto:')) {
    return url;
  }

  if (!/^https?:\/\//i.test(url)) {
    if (url.startsWith('//')) {
      url = `https:${url}`;
    } else {
      url = `https://${url}`;
    }
  }

  try {
    const parsed = new URL(url);
    return parsed.href;
  } catch (e) {
    return url;
  }
}

async function fetchAndUpsertRssJobs() {
  console.log('🔄 Initiating RemoteOK RSS fetch process...');
  const feedUrl = 'https://remoteok.com/remote-jobs.rss';

  try {
    console.log('⚠️ RemoteOK RSS feed is temporarily disabled/dead (HTTP 410). Skipping...');
    return;

    /*
    const feed = await parser.parseURL(feedUrl);
    const rawItems = feed.items || [];
    console.log(`✅ Successfully fetched ${rawItems.length} raw jobs from RemoteOK RSS.`);
    */

    if (rawItems.length === 0) {
      console.log('No jobs found in the RSS feed.');
      return;
    }

    // Map raw RSS items to our postgres database schema
    const mappedJobs = rawItems.map(item => {
      let category = 'Technology';
      if (item.tags) {
        const firstTag = item.tags.split(',')[0].trim();
        if (firstTag) {
          category = firstTag.charAt(0).toUpperCase() + firstTag.slice(1);
        }
      }

      const rawTitle = item.title ? item.title.trim() : 'Remote Position';
      const rawDesc = item.content ? item.content.trim() : (item.contentSnippet ? item.contentSnippet.trim() : '');
      
      if (detectAiRole(rawTitle, rawDesc)) {
        category = 'AI & Automation';
      }

      return {
        title: rawTitle,
        company: extractCompanyName(item),
        location: extractLocationName(item),
        job_type: extractJobType(item),
        url: sanitizeApplicationUrl(item.link || item.guid || ''),
        description: rawDesc,
        category: category,
        created_at: item.isoDate ? item.isoDate : (item.pubDate ? new Date(item.pubDate).toISOString() : new Date().toISOString())
      };
    }).filter(job => job.url); // filter out items without URLs

    console.log(`... Upserting ${mappedJobs.length} jobs into Supabase...`);

    const { data, error } = await supabase
      .from('jobs')
      .upsert(mappedJobs, { onConflict: 'url', ignoreDuplicates: true });

    if (error) {
      throw error;
    }

    console.log('🎉 Successfully completed RSS job sync process. Duplicate entries were skipped.');

  } catch (error) {
    console.warn('⚠️ Warning: Error executing RSS job sync:', error.message);
    process.exit(0);
  }
}

fetchAndUpsertRssJobs();
