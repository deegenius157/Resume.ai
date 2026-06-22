const fs = require('fs');
const path = require('path');
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


// 2. Configuration Parameters
const ADZUNA_APP_ID = process.env.ADZUNA_APP_ID || '80388a5b';
const ADZUNA_APP_KEY = process.env.ADZUNA_APP_KEY || '734f6394a33847dd19195ed41ab7fa1d';


const SUPABASE_URL = process.env.SUPABASE_URL || 'https://tkbibprszkrwgtmnexaz.supabase.co';
// service_role key is preferred for backend inserts. Fallback to publishing key if not set.
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_KEY || 'sb_publishable_QhnNbsU439dTjRHdaIpjBw_LqYPMBHH';

if (SUPABASE_KEY === 'sb_publishable_QhnNbsU439dTjRHdaIpjBw_LqYPMBHH') {
  console.warn('⚠️ Warning: Using fallback client anon key. Inserts might fail if RLS does not allow public inserts.');
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY, {
  auth: { persistSession: false }
});


// Helper function to strip HTML tags from Adzuna fields
const stripHtml = (str) => {
  if (!str) return '';
  return str.replace(/<\/?[^>]+(>|$)/g, '').trim();
};

async function fetchAndUpsertJobs() {
  console.log('🔄 Initiating Adzuna fetch process for African tech roles...');
  const countries = ['ng', 'za', 'ke'];
  const keywords = ['Software', 'Developer', 'Design', 'Data'];
  const resultsPerPage = 15;
  let allMappedJobs = [];

  for (const country of countries) {
    for (const keyword of keywords) {
      console.log(`📡 Fetching ${keyword} jobs in ${country.toUpperCase()}...`);
      const page = 1;
      const adzunaUrl = `https://api.adzuna.com/v1/api/jobs/${country}/search/${page}?app_id=${ADZUNA_APP_ID}&app_key=${ADZUNA_APP_KEY}&results_per_page=${resultsPerPage}&what=${encodeURIComponent(keyword)}`;

      try {
        const response = await fetch(adzunaUrl);
        if (!response.ok) {
          console.warn(`⚠️ Warning: Adzuna API responded with status ${response.status} for ${country}/${keyword}`);
          continue;
        }

        const data = await response.json();
        const rawJobs = data.results || [];
        console.log(`✅ Fetched ${rawJobs.length} raw jobs for ${keyword} in ${country.toUpperCase()}.`);

        // Map raw jobs to our postgres database schema
        const mappedJobs = rawJobs.map(job => {
          let loc = job.location?.display_name || 'Remote';
          if (loc.toLowerCase().includes('remote') || loc.toLowerCase().includes('worldwide')) {
            loc = 'Worldwide (Remote)';
          } else {
            loc = `${loc}, ${country.toUpperCase()}`;
          }

          return {
            title: stripHtml(job.title),
            company: job.company?.display_name || 'Hiring Company',
            url: job.redirect_url,
            description: stripHtml(job.description),
            category: job.category?.label || 'Technology',
            location: loc,
            created_at: job.created ? new Date(job.created).toISOString() : new Date().toISOString()
          };
        });

        allMappedJobs.push(...mappedJobs);
        // Delay to respect API limits
        await new Promise(resolve => setTimeout(resolve, 500));
      } catch (err) {
        console.error(`❌ Error fetching jobs for ${country}/${keyword}:`, err.message);
      }
    }
  }

  try {
    // Filter duplicates locally by URL
    const uniqueJobsMap = new Map();
    for (const job of allMappedJobs) {
      uniqueJobsMap.set(job.url, job);
    }
    const uniqueMappedJobs = Array.from(uniqueJobsMap.values());
    console.log(`✨ Total unique jobs fetched: ${uniqueMappedJobs.length}`);

    if (uniqueMappedJobs.length === 0) {
      console.log('No jobs found to upsert.');
      return;
    }

    console.log('⚡ Upserting jobs into Supabase...');

    // Use ignoreDuplicates: true which translates to ON CONFLICT (url) DO NOTHING
    const { data: upsertedData, error } = await supabase
      .from('jobs')
      .upsert(uniqueMappedJobs, { onConflict: 'url', ignoreDuplicates: true });

    if (error) {
      throw error;
    }

    console.log('🎉 Successfully completed job sync process. Duplicate entries were skipped.');

  } catch (error) {
    console.error('❌ Error executing job sync:', error.message);
    process.exit(1);
  }
}

// Execute the process
fetchAndUpsertJobs();
