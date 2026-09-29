const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

const oldCSS = `#start-screen {
            background: #f4f7f6;
            align-items: flex-start;
            padding: 40px 20px;
            overflow-y: auto;
        }`;

const newCSS = `#start-screen {
            background: #f4f7f6;
            align-items: center; 
            justify-content: flex-start; /* FIX: allows scrolling top to bottom */
            padding: 40px 20px;
            overflow-y: auto;
            position: fixed; /* Better for mobile scrolling */
        }`;

html = html.replace(oldCSS, newCSS);

// Also make the dash-header look better on mobile
const oldDashHeaderMedia = `@media (max-width: 768px) {
            .modules-grid { grid-template-columns: 1fr; }
            .dash-header { flex-direction: column; text-align: center; gap: 15px; }
            .progress-box { text-align: center; }
        }`;
        
const newDashHeaderMedia = `@media (max-width: 768px) {
            .modules-grid { grid-template-columns: 1fr; }
            .dash-header { flex-direction: column; text-align: center; gap: 15px; padding: 20px; }
            .dash-header h1 { font-size: 24px; }
            .progress-box { text-align: center; }
            #start-screen { padding: 20px 10px; }
        }`;

html = html.replace(oldDashHeaderMedia, newDashHeaderMedia);

fs.writeFileSync('index.html', html);
console.log('Mobile scroll fixed.');
