const cron = require('node-cron');
const { exec } = require('child_process');
const path = require('path');

/**
 * Helper to run a Node script as a child process and return a Promise
 */
function runScript(scriptPath) {
  return new Promise((resolve, reject) => {
    const scriptName = path.basename(scriptPath);
    console.log(`[${new Date().toISOString()}] 🔄 Running script: ${scriptName}`);
    
    exec(`node "${scriptPath}"`, (error, stdout, stderr) => {
      if (error) {
        console.error(`[${new Date().toISOString()}] ❌ Error running ${scriptName}:`, error.message);
        if (stderr) console.error(stderr);
        reject(error);
        return;
      }
      if (stdout) {
        console.log(`[${new Date().toISOString()}] 💬 Output from ${scriptName}:\n${stdout.trim()}`);
      }
      if (stderr) {
        console.warn(`[${new Date().toISOString()}] ⚠️ Stderr from ${scriptName}:\n${stderr.trim()}`);
      }
      resolve();
    });
  });
}

/**
 * Runs all sync scripts sequentially
 */
async function runAllSyncScripts() {
  console.log(`[${new Date().toISOString()}] 🚀 Starting job synchronization run...`);
  try {
    const fetchJobsPath = path.resolve(__dirname, 'fetch-jobs.js');
    const fetchRssPath = path.resolve(__dirname, 'fetch-rss.js');
    
    // Run Adzuna fetch first
    await runScript(fetchJobsPath);
    
    // Run RemoteOK RSS fetch second
    await runScript(fetchRssPath);
    
    console.log(`[${new Date().toISOString()}] 🎉 All sync scripts executed successfully.`);
  } catch (err) {
    console.error(`[${new Date().toISOString()}] 💥 Synchronization run encountered errors:`, err.message);
  }
}

// 1. Run immediately on server startup for verification
runAllSyncScripts();

// 2. Schedule the tasks to run every 5 minutes (ideal for verification loop)
// For production, this could be changed to e.g., '0 */12 * * *' (every 12 hours)
cron.schedule('*/5 * * * *', () => {
  console.log(`\n⏰ [${new Date().toISOString()}] Scheduled Cron Triggered!`);
  runAllSyncScripts();
});

console.log('💼 Genusjob Ingestion Orchestrator Service is active.');
console.log('📅 Cron Schedule: Running every 5 minutes (*/5 * * * *)');
