const fs = require('fs');
const path = require('path');

const brainDir = 'C:/Users/uthma/.gemini/antigravity/brain';
try {
  const folders = fs.readdirSync(brainDir);
  for (const folder of folders) {
    const walkthroughPath = path.join(brainDir, folder, 'walkthrough.md');
    if (fs.existsSync(walkthroughPath)) {
      const content = fs.readFileSync(walkthroughPath, 'utf8');
      const firstLines = content.split('\n').slice(0, 10).join('\n');
      console.log(`=== FOLDER: ${folder} ===`);
      console.log(firstLines);
      console.log('------------------------\n');
    }
  }
} catch (e) {
  console.error(e);
}
