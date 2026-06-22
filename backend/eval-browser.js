const wsUrl = 'ws://127.0.0.1:57345/devtools/page/2F37DC0C34B175C2FF91DBD674D8CFF9';

async function run() {
  const ws = new WebSocket(wsUrl);
  
  ws.onopen = () => {
    console.log('Connected to CDP');
    
    // Evaluate script on the page
    const cmd = {
      id: 1,
      method: 'Runtime.evaluate',
      params: {
        expression: 'JSON.stringify({ localStorage: {...localStorage}, sessionStorage: {...sessionStorage} })'
      }
    };
    ws.send(JSON.stringify(cmd));
  };
  
  ws.onmessage = (event) => {
    const data = JSON.parse(event.data);
    if (data.id === 1) {
      console.log('Evaluation result:');
      console.log(data.result?.result?.value);
      ws.close();
    }
  };
  
  ws.onerror = (e) => {
    console.error('WebSocket error:', e);
  };
}

run();
