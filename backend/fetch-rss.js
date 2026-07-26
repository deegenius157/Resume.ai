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
    item: ['company', 'tags', 'location']
  }
});

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

// Helper to detect if a job is AI or AI-enabled based on title and description
function detectAiRole(title = '', description = '') {
  const text = `${title} ${description}`.toLowerCase();
  const keywords = [
    'artificial intelligence', 'machine learning', 'llm', 'large language model',
    'prompt engineer', 'prompt engineering', 'data annotation', 'ai ops', 'ai operations',
    'generative ai', 'deep learning', 'nlp', 'natural language processing',
    'neural network', 'chatgpt', 'openai', 'anthropic', 'langchain', 'computer vision',
    'automation engineer', 'ai specialist', 'ai developer', 'ai researcher'
  ];

  if (/\b(ai|a\.i\.)\b/i.test(text)) return true;
  if (/\b(prompt|automation)\b/i.test(text)) return true;

  return keywords.some(kw => text.includes(kw));
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
        company: item.company ? item.company.trim() : 'Remote Company',
        url: item.link ? item.link.trim() : '',
        description: rawDesc,
        category: category,
        location: item.location ? item.location.trim() : 'Remote',
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
