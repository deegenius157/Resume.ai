const fs = require('fs');
const path = require('path');

const filePath = 'c:/Users/uthma/Desktop/Ai-Resume-Builder/client/dist/assets/index-BBIRr3l8.js';
if (fs.existsSync(filePath)) {
  const content = fs.readFileSync(filePath, 'utf8');
  
  // Regex for supabase URL
  const urls = content.match(/https:\/\/[a-zA-Z0-9-]+\.supabase\.co/g) || [];
  const sbPubs = content.match(/sb_publishable_[a-zA-Z0-9-_]+/g) || [];
  const sbSecrets = content.match(/sb_secret_[a-zA-Z0-9-_]+/g) || [];
  
  console.log('URLs found in dist:', [...new Set(urls)]);
  console.log('Publishable keys found in dist:', [...new Set(sbPubs)]);
  console.log('Secret keys found in dist:', [...new Set(sbSecrets)]);
  
  // Let's print any lines or context around the matches
  urls.forEach(url => {
    const index = content.indexOf(url);
    if (index !== -1) {
      console.log(`Context around ${url}:`, content.substring(Math.max(0, index - 100), Math.min(content.length, index + 200)));
    }
  });
} else {
  console.log('File does not exist!');
}
