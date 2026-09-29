const fs = require('fs');
const path = require('path');

// 1. Read the original HTML
let html = fs.readFileSync('celpip_study.html', 'utf8');

// 2. Read the JS data file
let jsData = fs.readFileSync('celpip_data.js', 'utf8');

// 3. Find all mp3 references in the jsData and convert them to base64
// We know audio files are named like "audio_0.mp3"
const audioFiles = fs.readdirSync('.').filter(f => f.endsWith('.mp3') && !f.startsWith('real_test'));

for (let audioFile of audioFiles) {
    console.log('Converting', audioFile, 'to base64...');
    const mp3Buffer = fs.readFileSync(audioFile);
    const base64Audio = 'data:audio/mpeg;base64,' + mp3Buffer.toString('base64');
    
    // Replace the exact filename in the jsData with the massive base64 string
    // e.g. "audioUrl": "audio_0.mp3" -> "audioUrl": "data:audio/mpeg;base64,..."
    jsData = jsData.replace(audioFile, base64Audio);
}

// 4. Inject the modified JS data directly into the HTML
const scriptTagToReplace = '<script src="celpip_data.js"></script>';
const inlineScript = `<script>\n${jsData}\n</script>`;
html = html.replace(scriptTagToReplace, inlineScript);

// 5. Save the final mega HTML
fs.writeFileSync('index.html', html);
console.log('Successfully built index.html (' + (html.length / 1024 / 1024).toFixed(2) + ' MB)');
