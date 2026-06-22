async function run() {
  const wsUrl = process.env.AGY_BROWSER_WS_URL || '';
  if (!wsUrl) {
    console.log('No AGY_BROWSER_WS_URL found');
    return;
  }
  
  // Extract host and port from ws://127.0.0.1:57345/devtools/browser/...
  const match = wsUrl.match(/ws:\/\/([^/]+)/);
  if (!match) {
    console.log('Could not parse host from wsUrl:', wsUrl);
    return;
  }
  
  const host = match[1];
  const url = `http://${host}/json/list`;
  console.log(`Fetching targets from ${url}...`);
  
  try {
    const res = await fetch(url);
    const data = await res.json();
    console.log('Browser targets found:');
    console.log(JSON.stringify(data, null, 2));
  } catch (e) {
    console.error('Fetch failed:', e.message);
  }
}

run();
