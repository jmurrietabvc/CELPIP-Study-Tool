/**
 * ULTIMATE CELPIP SCRAPER (Persistent across pages)
 * 
 * Instructions:
 * 1. Log in and start your practice test.
 * 2. Paste this entire script into your Developer Tools Console and press Enter.
 * 3. A floating panel will appear in the bottom right corner of your screen.
 * 4. As you navigate through the test, click "Scrape Current Screen" on each new question/passage.
 * 5. When you finish the test, click "Download JSON" to save all the collected data.
 */

(function() {
    // Prevent multiple overlays
    if (document.getElementById('celpip-scraper-overlay')) return;

    // Initialize state from sessionStorage
    let scrapedTest = JSON.parse(sessionStorage.getItem('celpip_scraped_test') || '{"passage":"","audioUrl":"","questions":[]}');

    // Create Floating UI
    const overlay = document.createElement('div');
    overlay.id = 'celpip-scraper-overlay';
    overlay.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        width: 300px;
        background: #1e293b;
        color: white;
        border-radius: 12px;
        padding: 16px;
        box-shadow: 0 10px 25px rgba(0,0,0,0.5);
        z-index: 999999;
        font-family: Arial, sans-serif;
    `;

    function updateUI() {
        overlay.innerHTML = `
            <div style="font-weight: bold; margin-bottom: 10px; font-size: 16px;">CELPIP Scraper Active</div>
            <div style="font-size: 13px; margin-bottom: 15px; color: #cbd5e1;">
                Saved Questions: ${scrapedTest.questions.length}<br>
                Has Passage: ${scrapedTest.passage ? 'Yes' : 'No'}<br>
                Has Audio: ${scrapedTest.audioUrl ? 'Yes' : 'No'}
            </div>
            <button id="btn-scrape" style="width:100%; padding:8px; margin-bottom:8px; background:#3b82f6; color:white; border:none; border-radius:6px; cursor:pointer;">1. Scrape Current Screen</button>
            <button id="btn-download" style="width:100%; padding:8px; margin-bottom:8px; background:#10b981; color:white; border:none; border-radius:6px; cursor:pointer;">2. Download JSON</button>
            <button id="btn-clear" style="width:100%; padding:8px; background:#ef4444; color:white; border:none; border-radius:6px; cursor:pointer;">Reset/Clear</button>
        `;

        document.getElementById('btn-scrape').onclick = scrapeCurrentScreen;
        document.getElementById('btn-download').onclick = downloadJson;
        document.getElementById('btn-clear').onclick = clearData;
    }

    function extractTextContent(el) {
        if (!el) return '';
        // Skip hidden elements
        const style = window.getComputedStyle(el);
        if (style.display === 'none' || style.visibility === 'hidden' || style.opacity === '0') return '';
        return el.innerText ? el.innerText.trim() : el.textContent.trim();
    }

    function scrapeCurrentScreen() {
        console.log("Scraping current screen...");

        // 1. Scrape Audio
        const audioEl = document.querySelector('audio source, audio');
        if (audioEl && audioEl.src && !scrapedTest.audioUrl) {
            scrapedTest.audioUrl = audioEl.src;
            console.log("Found audio:", audioEl.src);
        }

        // 2. Scrape Passage (find largest text blocks on the left side or main content)
        // We look for typical passage tags.
        if (!scrapedTest.passage) {
            let passageBlocks = [];
            document.querySelectorAll('article p, .passage p, .reading-text p, h3, h4').forEach(el => {
                let text = extractTextContent(el);
                if (text.length > 50 && !el.closest('header, footer, nav, .menu')) {
                    passageBlocks.push(text);
                }
            });
            if (passageBlocks.length > 0) {
                scrapedTest.passage = [...new Set(passageBlocks)].join('\n\n');
                console.log("Found passage text.");
            }
        }

        // 3. Scrape Questions & Options
        // Strategy: find all radio buttons or checkboxes.
        const inputs = Array.from(document.querySelectorAll('input[type="radio"], input[type="checkbox"], [role="radio"]'));
        
        if (inputs.length > 0) {
            // Group inputs by name to form discrete questions
            const groups = {};
            inputs.forEach(input => {
                let name = input.name || input.getAttribute('name') || 'unknown';
                
                // If inputs don't have names, group them by their common parent structure
                if (name === 'unknown') {
                    const parentBlock = input.closest('fieldset, .question, .q-block, div[class*="question"], ul, form') || input.parentElement.parentElement;
                    name = parentBlock ? (parentBlock.id || parentBlock.className || 'group_' + Math.random()) : 'group_' + Math.random();
                }

                if (!groups[name]) groups[name] = [];
                groups[name].push(input);
            });

            // Extract each question block
            for (const groupName in groups) {
                const groupInputs = groups[groupName];
                const options = [];
                let correctIdx = -1;
                
                groupInputs.forEach((input, idx) => {
                    // Look for the label text
                    let label = input.closest('label');
                    let labelText = '';
                    if (label) {
                        labelText = extractTextContent(label).replace(extractTextContent(input), '').trim();
                    } else if (input.nextElementSibling) {
                        labelText = extractTextContent(input.nextElementSibling);
                    } else if (input.parentElement && input.parentElement.innerText) {
                        labelText = extractTextContent(input.parentElement);
                    }

                    if (labelText) options.push(labelText);
                    
                    // Try to guess if it's correct (if classes contain 'correct')
                    let parentHtml = (input.closest('label, li, .option') || input).outerHTML.toLowerCase();
                    if (parentHtml.includes('correct') || parentHtml.includes('right-answer') || input.checked) {
                        correctIdx = idx;
                    }
                });

                // Try to find the question text preceding the options
                let qText = "Question " + (scrapedTest.questions.length + 1);
                let firstInput = groupInputs[0];
                let container = firstInput.closest('fieldset, .question, .q-block, div[class*="question"]');
                
                if (container) {
                    // Find a heading or bold text inside the container
                    let potentialQ = container.querySelector('legend, h3, h4, h5, p strong, .q-text, [class*="title"]');
                    if (potentialQ) qText = extractTextContent(potentialQ);
                } else {
                    // Look just before the first input
                    let prev = firstInput.parentElement.previousElementSibling;
                    if (prev && extractTextContent(prev).length > 5) {
                        qText = extractTextContent(prev);
                    }
                }

                // Make sure we haven't already saved this question
                const exists = scrapedTest.questions.find(q => q.text === qText && q.options.join() === options.join());
                if (!exists && options.length > 0) {
                    scrapedTest.questions.push({
                        text: qText,
                        options: options,
                        correctAnswerIndex: correctIdx
                    });
                }
            }
            console.log("Scraped options/questions from radio buttons.");
        } else {
            // Fallback: look for dropdowns (Selects) which are often used in Reading tasks
            const selects = document.querySelectorAll('select');
            selects.forEach(select => {
                const options = Array.from(select.querySelectorAll('option')).map(o => extractTextContent(o)).filter(o => o && !o.toLowerCase().includes('select'));
                if (options.length > 0) {
                    // The text of the question is likely around it
                    let context = select.parentElement.innerText.substring(0, 50).trim();
                    scrapedTest.questions.push({
                        text: `Dropdown near: "${context}..."`,
                        options: options,
                        correctAnswerIndex: select.selectedIndex > 0 ? select.selectedIndex - 1 : -1 // adjust for default "select..." option
                    });
                }
            });
        }

        // Save state
        sessionStorage.setItem('celpip_scraped_test', JSON.stringify(scrapedTest));
        updateUI();
        
        // Visual feedback
        const btn = document.getElementById('btn-scrape');
        const oldText = btn.innerText;
        btn.innerText = "✅ Scraped!";
        btn.style.background = "#10b981";
        setTimeout(() => {
            btn.innerText = oldText;
            btn.style.background = "#3b82f6";
        }, 1500);
    }

    function downloadJson() {
        if (scrapedTest.questions.length === 0 && !scrapedTest.passage && !scrapedTest.audioUrl) {
            alert("Nothing to download yet! Scrape some screens first.");
            return;
        }

        const isListening = !!scrapedTest.audioUrl;
        const filename = isListening ? 'celpip_listening.json' : 'celpip_reading.json';
        
        // Format as an array (since the study app expects an array of tests)
        const finalData = [scrapedTest];

        const blob = new Blob([JSON.stringify(finalData, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    function clearData() {
        if (confirm("Are you sure you want to clear the collected data?")) {
            scrapedTest = { passage: "", audioUrl: "", questions: [] };
            sessionStorage.removeItem('celpip_scraped_test');
            updateUI();
        }
    }

    document.body.appendChild(overlay);
    updateUI();
    console.log("✅ Floating Scraper UI activated!");

})();
