const path = require('path');
const { createClient } = require('@supabase/supabase-js');

require('dotenv').config({ path: path.resolve(__dirname, '../.env.local') });
require('dotenv').config({ path: path.resolve(__dirname, '../../.env.local') });

const SUPABASE_URL = process.env.SUPABASE_URL || 'https://tkbibprszkrwgtmnexaz.supabase.co';
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_KEY || 'sb_publishable_QhnNbsU439dTjRHdaIpjBw_LqYPMBHH';

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY, {
  auth: { persistSession: false }
});

const EXCLUDED_TERMS = [
  'driver', 'teacher', 'maintenance', 'cleaner', 'janitor', 'cook', 'school',
  'academy', 'security guard', 'tutor', 'housekeeper', 'nanny', 'chef',
  'receptionist', 'driver/', 'bus driver', 'truck driver', 'classroom', 'blooms academy'
];

async function cleanNonTechJobs() {
  console.log('🧹 Initiating Supabase job database cleanup for non-relevant positions...');

  try {
    const { data: allJobs, error } = await supabase.from('jobs').select('id, job_id, title, company');
    if (error) throw error;

    console.log(`🔍 Total jobs in database: ${allJobs?.length || 0}`);

    const idsToDelete = [];
    allJobs.forEach(job => {
      const titleLower = (job.title || '').toLowerCase();
      const companyLower = (job.company || '').toLowerCase();
      const matchesExclusion = EXCLUDED_TERMS.some(term => {
        const regex = new RegExp(`\\b${term.toLowerCase()}\\b`, 'i');
        return regex.test(titleLower) || titleLower.includes(term.toLowerCase()) || companyLower.includes(term.toLowerCase());
      });

      if (matchesExclusion) {
        console.log(`🚨 Flagged for deletion: [ID: ${job.id || job.job_id}] "${job.title}" at "${job.company || 'Unknown'}"`);
        idsToDelete.push(job.id || job.job_id);
      }
    });

    if (idsToDelete.length === 0) {
      console.log('✨ No non-relevant positions found in database. Clean-up complete!');
      return;
    }

    console.log(`🗑️ Deleting ${idsToDelete.length} non-relevant records from Supabase...`);
    const { error: deleteError } = await supabase
      .from('jobs')
      .delete()
      .in('id', idsToDelete);

    if (deleteError) {
      // Try fallback delete by job_id
      const { error: fallbackError } = await supabase
        .from('jobs')
        .delete()
        .in('job_id', idsToDelete);
      if (fallbackError) throw fallbackError;
    }

    console.log(`✅ Successfully deleted ${idsToDelete.length} non-relevant positions from Supabase.`);
  } catch (err) {
    console.error('❌ Database cleanup failed:', err.message);
  }
}

cleanNonTechJobs();
