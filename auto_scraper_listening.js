const { chromium } = require('playwright');
const fs = require('fs');

(async () => {
  console.log('🚀 Launching LISTENING Auto-Crawler for practicecelpip.ca...');
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();
  const page = await context.newPage();

  console.log('👉 Please log in to practicecelpip.ca in the opened browser window.');
  console.log('⏳ Waiting for 60 seconds...');
  
  await page.goto('https://practicecelpip.ca/sign-in');
  await page.waitForTimeout(60000); 
  console.log('✅ 60 seconds passed. Starting the automated bulk scrape for LISTENING...');

  const allListeningTests = [];

  // Scrape Parts 1 to 6 for listening
  for (let part = 1; part <= 6; part++) {
    console.log(`\n🔍 Scanning Catalog for Listening Part ${part}...`);
    await page.goto(`https://practicecelpip.ca/practice-questions/listening/part-${part}`);
    await page.waitForTimeout(3000);

    const testLinks = await page.evaluate((partNum) => {
      const links = Array.from(document.querySelectorAll('a[href*="/listening/part-' + partNum + '-"]'));
      return links.map(a => a.href);
    }, part);

    console.log(`Found ${testLinks.length} tests in Listening Part ${part}.`);

    for (const link of testLinks) {
      console.log(`Scraping: ${link}`);
      await page.goto(link);
      await page.waitForTimeout(4000); // Wait for React to load audio & questions

      const testData = await page.evaluate(() => {
        const clean = el => (el?.innerText || el?.textContent || "").trim();
        
        // 1. Audio
        const audioUrl = document.querySelector("audio")?.currentSrc || document.querySelector("audio")?.src || "";

        // 2. Questions
        const radios = [...document.querySelectorAll('input[type="radio"]')];
        const groups = new Map();
        for (const radio of radios) {
          const key = radio.name || radio.closest('fieldset') || radio;
          if (!groups.has(key)) groups.set(key, []);
          const label = radio.labels?.[0] || radio.closest("label");
          groups.get(key).push(clean(label) || radio.value);
        }

        const questions = [...groups].map(([key, options]) => {
          const radio = typeof key === "string" ? radios.find(r => r.name === key) : key.querySelector?.('input[type="radio"]') || key;
          const fieldset = radio?.closest("fieldset,[role='radiogroup'], .question, .q-block");
          const text = fieldset ? clean(fieldset).replace(options.join(" "), "").replace(options.join(""), "").trim() : "Question";
          return { text, options };
        });

        // 3. Title
        const title = document.title || "Listening Test";

        return { title, audioUrl, questions };
      });

      if (testData.questions.length > 0 || testData.audioUrl) {
        allListeningTests.push(testData);
      }
    }
  }

  // Save everything
  fs.writeFileSync('celpip_listening.json', JSON.stringify(allListeningTests, null, 2));
  console.log(`\n🎉 DONE! Bulk scraped ${allListeningTests.length} tests and saved to celpip_listening.json.`);
  
  await browser.close();
})();
