const fs = require('fs');

let html = fs.readFileSync('index.html', 'utf8');

// 1. Inject modern CSS for the Dashboard
const newCSS = `
        /* --- MODERN DASHBOARD CSS --- */
        #start-screen {
            background: #f4f7f6;
            align-items: flex-start;
            padding: 40px 20px;
            overflow-y: auto;
        }
        .dashboard-container {
            max-width: 1200px;
            width: 100%;
            margin: 0 auto;
            font-family: 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
            color: #333;
        }
        .dash-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            background: white;
            padding: 30px;
            border-radius: 12px;
            box-shadow: 0 4px 6px rgba(0,0,0,0.05);
            margin-bottom: 30px;
        }
        .dash-header h1 { margin: 0; color: #2c3e50; font-size: 28px; }
        .dash-header p { margin: 5px 0 0 0; color: #7f8c8d; font-size: 16px; }
        
        .progress-box {
            text-align: right;
        }
        .progress-text { font-size: 24px; font-weight: bold; color: var(--celpip-blue); }
        .progress-sub { font-size: 12px; color: #95a5a6; text-transform: uppercase; letter-spacing: 1px; }
        
        .modules-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 30px;
        }
        .module-section h2 {
            border-bottom: 2px solid #e0e6ed;
            padding-bottom: 10px;
            color: #34495e;
            margin-bottom: 20px;
        }
        .test-list {
            display: flex;
            flex-direction: column;
            gap: 15px;
        }
        .test-card {
            background: white;
            padding: 20px;
            border-radius: 8px;
            border-left: 5px solid #bdc3c7;
            box-shadow: 0 2px 4px rgba(0,0,0,0.04);
            display: flex;
            justify-content: space-between;
            align-items: center;
            transition: transform 0.2s;
        }
        .test-card:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 8px rgba(0,0,0,0.08);
        }
        .test-card.completed { border-left-color: #2ecc71; }
        
        .test-info h3 { margin: 0 0 5px 0; font-size: 16px; color: #2c3e50; }
        .test-info p { margin: 0; font-size: 13px; color: #7f8c8d; }
        .score-badge {
            background: #e8f8f5;
            color: #1abc9c;
            padding: 4px 8px;
            border-radius: 4px;
            font-size: 12px;
            font-weight: bold;
            margin-top: 5px;
            display: inline-block;
        }
        .btn-play {
            background: var(--celpip-blue);
            color: white;
            border: none;
            padding: 10px 20px;
            border-radius: 20px;
            font-weight: bold;
            cursor: pointer;
            transition: 0.2s;
        }
        .btn-play:hover { background: #0056b3; }
        
        @media (max-width: 768px) {
            .modules-grid { grid-template-columns: 1fr; }
            .dash-header { flex-direction: column; text-align: center; gap: 15px; }
            .progress-box { text-align: center; }
        }
        /* -------------------------- */
</style>`;

html = html.replace('</style>', newCSS);

// 2. Replace the old start-screen UI
const oldStartScreenRegex = /<div id="start-screen" class="overlay">[\s\S]*?<\/div>\s*<\/div>/;
const newStartScreen = `<div id="start-screen" class="overlay">
        <div class="dashboard-container">
            <div class="dash-header">
                <div>
                    <h1>CELPIP Mastery Hub</h1>
                    <p>CLB 12 Extreme Training Simulator</p>
                </div>
                <div class="progress-box">
                    <div class="progress-text" id="overall-progress">0 / 0</div>
                    <div class="progress-sub">Tests Completed</div>
                </div>
            </div>

            <div class="modules-grid">
                <div class="module-section">
                    <h2>📚 Reading Modules</h2>
                    <div class="test-list" id="reading-list">
                        <!-- Populated by JS -->
                    </div>
                </div>
                
                <div class="module-section">
                    <h2>🎧 Listening Modules</h2>
                    <div class="test-list" id="listening-list">
                        <!-- Populated by JS -->
                    </div>
                </div>
            </div>
        </div>
    </div>`;

html = html.replace(oldStartScreenRegex, newStartScreen);

// 3. Inject JS to power the dashboard (replace init function)
const oldInit = `        // Populate test selector
        window.onload = () => {
            const selector = document.getElementById('test-selector');
            readingData.forEach((test, idx) => {
                const opt = document.createElement('option');
                opt.value = 'R' + idx;
                opt.innerText = test.title || ("Reading Test " + (idx+1));
                selector.appendChild(opt);
            });
            listeningData.forEach((test, idx) => {
                const opt = document.createElement('option');
                opt.value = 'L' + idx;
                opt.innerText = test.title || ("Listening Test " + (idx+1));
                selector.appendChild(opt);
            });
        };`;

const newInit = `        // Dashboard Logic
        let savedScores = JSON.parse(localStorage.getItem('celpipScores')) || {};
        
        window.onload = () => {
            renderDashboard();
        };

        function renderDashboard() {
            const rList = document.getElementById('reading-list');
            const lList = document.getElementById('listening-list');
            rList.innerHTML = '';
            lList.innerHTML = '';
            
            let completedCount = 0;
            let totalCount = readingData.length + listeningData.length;

            readingData.forEach((test, idx) => {
                const id = 'R' + idx;
                const score = savedScores[id];
                if (score !== undefined) completedCount++;
                rList.appendChild(createTestCard(test.title || "Reading Test " + (idx+1), id, score, 'R', idx));
            });

            listeningData.forEach((test, idx) => {
                const id = 'L' + idx;
                const score = savedScores[id];
                if (score !== undefined) completedCount++;
                lList.appendChild(createTestCard(test.title || "Listening Test " + (idx+1), id, score, 'L', idx));
            });

            document.getElementById('overall-progress').innerText = completedCount + " / " + totalCount;
        }

        function createTestCard(title, id, score, type, idx) {
            const div = document.createElement('div');
            div.className = 'test-card ' + (score !== undefined ? 'completed' : '');
            
            const info = document.createElement('div');
            info.className = 'test-info';
            info.innerHTML = \`<h3>\${title}</h3>\`;
            
            if (score !== undefined) {
                info.innerHTML += \`<div class="score-badge">Score: \${score}/5</div>\`;
            } else {
                info.innerHTML += \`<p>Status: Not started</p>\`;
            }

            const btn = document.createElement('button');
            btn.className = 'btn-play';
            btn.innerText = score !== undefined ? 'RETRY' : 'START';
            btn.onclick = () => startTestFromDash(type, idx);

            div.appendChild(info);
            div.appendChild(btn);
            return div;
        }

        function startTestFromDash(type, idx) {
            if (type === 'R') {
                currentTest = readingData[idx];
                isListening = false;
                timeLeft = 10 * 60;
                currentTestId = 'R' + idx;
            } else {
                currentTest = listeningData[idx];
                isListening = true;
                timeLeft = 5 * 60;
                currentTestId = 'L' + idx;
            }
            
            document.getElementById('start-screen').style.display = 'none';
            document.getElementById('score-screen').style.display = 'none';
            document.getElementById('exam-title').innerText = currentTest.title || "CELPIP Practice";
            
            isReviewMode = false;
            renderExamUI();
            if (!isListening) startTimer();
        }`;

html = html.replace(oldInit, newInit);

// 4. Track currentTestId globally
html = html.replace('let isReviewMode = false;', "let isReviewMode = false;\n        let currentTestId = null;");

// 5. Remove the old startTest function since we use startTestFromDash
html = html.replace(/function startTest\(\) \{[\s\S]*?renderExamUI\(\);\s*if \(\!isListening\) startTimer\(\);\s*\}/, '');

// 6. Save score when submitting test
const submitLogicRegex = /document\.getElementById\('final-score'\)\.innerText = score \+ "\/" \+ total;/;
const newSubmitLogic = `document.getElementById('final-score').innerText = score + "/" + total;
            
            // Save to localStorage
            if (currentTestId) {
                savedScores[currentTestId] = score;
                localStorage.setItem('celpipScores', JSON.stringify(savedScores));
                renderDashboard(); // Refresh dashboard in background
            }`;
html = html.replace(submitLogicRegex, newSubmitLogic);

fs.writeFileSync('index.html', html);
console.log('Successfully upgraded UI to Modern Dashboard');
