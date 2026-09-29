const fs = require('fs');

let lData = JSON.parse(fs.readFileSync('celpip_listening.json', 'utf8'));

lData.forEach(test => {
    if (test.audioUrl && !test.audioUrl.startsWith('audio/')) {
        test.audioUrl = 'audio/' + test.audioUrl;
    }
});

fs.writeFileSync('celpip_listening.json', JSON.stringify(lData, null, 2));

// Also regenerate celpip_data.js
let rData = JSON.parse(fs.readFileSync('celpip_reading.json', 'utf8'));
const jsContent = `const readingData = ${JSON.stringify(rData, null, 2)};\nconst listeningData = ${JSON.stringify(lData, null, 2)};`;
fs.writeFileSync('celpip_data.js', jsContent);
console.log('Fixed audio URLs');
