const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

// The HTML was successfully replaced, but the JS was not.
// We need to rip out the old window.onload block and the startTest function.

const jsFix = `
        // Dashboard Logic
        let savedScores = JSON.parse(localStorage.getItem('celpipScores')) || {};
        
        window.onload = () => {
            renderDashboard();
        };

        function renderDashboard() {
            const rList = document.getElementById('reading-list');
            const lList = document.getElementById('listening-list');
            if(rList) rList.innerHTML = '';
            if(lList) lList.innerHTML = '';
            
            let completedCount = 0;
            let totalCount = (typeof readingData !== 'undefined' ? readingData.length : 0) + (typeof listeningData !== 'undefined' ? listeningData.length : 0);

            if (typeof readingData !== 'undefined') {
                readingData.forEach((test, idx) => {
                    const id = 'R' + idx;
                    const score = savedScores[id];
                    if (score !== undefined) completedCount++;
                    rList.appendChild(createTestCard(test.title || "Reading Test " + (idx+1), id, score, 'R', idx));
                });
            }

            if (typeof listeningData !== 'undefined') {
                listeningData.forEach((test, idx) => {
                    const id = 'L' + idx;
                    const score = savedScores[id];
                    if (score !== undefined) completedCount++;
                    lList.appendChild(createTestCard(test.title || "Listening Test " + (idx+1), id, score, 'L', idx));
                });
            }

            const overall = document.getElementById('overall-progress');
            if(overall) overall.innerText = completedCount + " / " + totalCount;
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
        }
`;

// Find everything from window.onload up to function renderExamUI()
const regex = /window\.onload[\s\S]*?(?=function renderExamUI)/;
html = html.replace(regex, jsFix);

// Find the old startTest function and remove it if it's there
html = html.replace(/function startTest\(\)[\s\S]*?if \(!isListening\) startTimer\(\);\s*\}\s*/, '');

fs.writeFileSync('index.html', html);
console.log('JS patched');
