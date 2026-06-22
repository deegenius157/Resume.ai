const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

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

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// Helper function to strip HTML tags from Adzuna fields
const stripHtml = (str) => {
  if (!str) return '';
  return str.replace(/<\/?[^>]+(>|$)/g, '').trim();
};

async function fetchAndUpsertJobs() {
  console.log('🔄 Initiating Adzuna fetch process...');
  const searchWhat = 'remote tech';
  const page = 1;
  const adzunaUrl = `https://api.adzuna.com/v1/api/jobs/us/search/${page}?app_id=${ADZUNA_APP_ID}&app_key=${ADZUNA_APP_KEY}&results_per_page=30&what=${encodeURIComponent(searchWhat)}`;

  try {
    const response = await fetch(adzunaUrl);
    if (!response.ok) {
      throw new Error(`Adzuna API responded with status ${response.status}`);
    }

    const data = await response.json();
    const rawJobs = data.results || [];
    console.log(`✅ Successfully fetched ${rawJobs.length} raw jobs from Adzuna.`);

    if (rawJobs.length === 0) {
      console.log('No jobs found to upsert.');
      return;
    }

    // Map raw jobs to our postgres database schema
    const mappedJobs = rawJobs.map(job => {
      // Normalize location
      let loc = job.location?.display_name || 'Remote';
      if (loc.toLowerCase().includes('remote') || loc.toLowerCase().includes('worldwide')) {
        loc = 'Worldwide (Remote)';
      } else {
        loc = 'Remote (Worldwide)';
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

    console.log('⚡ Upserting jobs into Supabase...');

    // Use ignoreDuplicates: true which translates to ON CONFLICT (url) DO NOTHING
    const { data: upsertedData, error } = await supabase
      .from('jobs')
      .upsert(mappedJobs, { onConflict: 'url', ignoreDuplicates: true });

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
