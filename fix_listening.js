const fs = require('fs');

let html = fs.readFileSync('celpip_study.html', 'utf8');

// 1. Remove startTimer() from the init flow so it doesn't start immediately for listening
html = html.replace(/isReviewMode = false;\s*renderExamUI\(\);\s*startTimer\(\);/, 'isReviewMode = false;\n            renderExamUI();\n            if (!isListening) startTimer();');

// 2. Hide questions initially in Listening
const replaceTarget = `            // Append questions
            currentTest.questions.forEach((q, i) => {
                const qDiv = document.createElement('div');
                qDiv.className = 'question-block';`;

const replacement = `            // Hide questions initially if listening
            const questionsWrapper = document.createElement('div');
            questionsWrapper.id = 'questions-wrapper';
            if (isListening) {
                questionsWrapper.style.display = 'none'; // HIDDEN UNTIL AUDIO FINISHES
                
                setTimeout(() => {
                    const nativeAudio = document.querySelector('audio');
                    if (nativeAudio) {
                        nativeAudio.onended = () => {
                            questionsWrapper.style.display = 'block';
                            startTimer();
                        };
                    }
                }, 500);
            }
            rightPanel.appendChild(questionsWrapper);

            // Append questions
            currentTest.questions.forEach((q, i) => {
                const qDiv = document.createElement('div');
                qDiv.className = 'question-block';`;
html = html.replace(replaceTarget, replacement);

const appendTarget = `                    const label = document.createElement('label');
                    label.className = 'option-label';
                    label.innerHTML = \`<input type="radio" name="q\${i}" value="\${optIndex}"> \${opt}\`;
                    qDiv.appendChild(label);
                });
                
                rightPanel.appendChild(qDiv);`;

const appendReplacement = `                    const label = document.createElement('label');
                    label.className = 'option-label';
                    label.innerHTML = \`<input type="radio" name="q\${i}" value="\${optIndex}"> \${opt}\`;
                    qDiv.appendChild(label);
                });
                
                questionsWrapper.appendChild(qDiv);`;
html = html.replace(appendTarget, appendReplacement);

// 3. For TTS fallback, show questions when it ends
const ttsEndTarget = `            // Revert button when finished
            ttsUtterance.onend = () => {
                btn.innerText = "AUDIO FINISHED";
            };`;
const ttsEndReplacement = `            // Revert button when finished
            ttsUtterance.onend = () => {
                btn.innerText = "AUDIO FINISHED";
                btn.disabled = true;
                const wrapper = document.getElementById('questions-wrapper');
                if (wrapper) wrapper.style.display = 'block';
                startTimer();
            };`;
html = html.replace(ttsEndTarget, ttsEndReplacement);

fs.writeFileSync('celpip_study.html', html);
console.log('Fixed listening workflow.');
