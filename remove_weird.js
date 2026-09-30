const fs = require('fs');

let rData = JSON.parse(fs.readFileSync('celpip_reading.json', 'utf8'));
let lData = JSON.parse(fs.readFileSync('celpip_listening.json', 'utf8'));

// Filter out the weird ones based on title
const rKeep = rData.filter(t => !t.title.includes("Quantum") && !t.title.includes("Neurobiology") && !t.title.includes("Apply a Diagram"));
const lKeep = lData.filter(t => !t.title.includes("Linguistic Relativity") && !t.title.includes("News Item"));

fs.writeFileSync('celpip_reading.json', JSON.stringify(rKeep, null, 2));
fs.writeFileSync('celpip_listening.json', JSON.stringify(lKeep, null, 2));

const jsContent = `const readingData = ${JSON.stringify(rKeep, null, 2)};\nconst listeningData = ${JSON.stringify(lKeep, null, 2)};`;
fs.writeFileSync('celpip_data.js', jsContent);

console.log('Deleted weird topics. R:', rKeep.length, 'L:', lKeep.length);
