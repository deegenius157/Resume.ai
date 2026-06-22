const fs = require('fs');
const path = require('path');
const Parser = require('rss-parser');
const { createClient } = require('@supabase/supabase-js');

// 1. Load environment variables from .env.local if present
require('dotenv').config({ path: path.resolve(__dirname, '../.env.local') });
require('dotenv').config({ path: path.resolve(__dirname, '../../.env.local') });


const SUPABASE_URL = process.env.SUPABASE_URL || 'https://tkbibprszkrwgtmnexaz.supabase.co';
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_KEY) {
  console.error('❌ Error: SUPABASE_SERVICE_ROLE_KEY is not defined.');
  process.exit(1);
}


const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

const parser = new Parser({
  customFields: {
    item: ['company', 'tags', 'location']
  }
});

async function fetchAndUpsertRssJobs() {
  console.log('🔄 Initiating RemoteOK RSS fetch process...');
  const feedUrl = 'https://remoteok.com/remote-jobs.rss';

  try {
    const feed = await parser.parseURL(feedUrl);
    const rawItems = feed.items || [];
    console.log(`✅ Successfully fetched ${rawItems.length} raw jobs from RemoteOK RSS.`);

    if (rawItems.length === 0) {
      console.log('No jobs found in the RSS feed.');
      return;
    }

    // Map raw RSS items to our postgres database schema
    const mappedJobs = rawItems.map(item => {
      // Normalize category (capitalize first tag if available)
      let category = 'Technology';
      if (item.tags) {
        const firstTag = item.tags.split(',')[0].trim();
        if (firstTag) {
          category = firstTag.charAt(0).toUpperCase() + firstTag.slice(1);
        }
      }

      return {
        title: item.title ? item.title.trim() : 'Remote Position',
        company: item.company ? item.company.trim() : 'Remote Company',
        url: item.link ? item.link.trim() : '',
        description: item.content ? item.content.trim() : (item.contentSnippet ? item.contentSnippet.trim() : ''),
        category: category,
        location: item.location ? item.location.trim() : 'Remote',
        created_at: item.isoDate ? item.isoDate : (item.pubDate ? new Date(item.pubDate).toISOString() : new Date().toISOString())
      };
    }).filter(job => job.url); // filter out items without URLs

    console.log(`⚡ Upserting ${mappedJobs.length} jobs into Supabase...`);

    const { data, error } = await supabase
      .from('jobs')
      .upsert(mappedJobs, { onConflict: 'url', ignoreDuplicates: true });

    if (error) {
      throw error;
    }

    console.log('🎉 Successfully completed RSS job sync process. Duplicate entries were skipped.');

  } catch (error) {
    console.error('❌ Error executing RSS job sync:', error.message);
    process.exit(1);
  }
}

fetchAndUpsertRssJobs();
