const { chromium } = require('playwright');
const fs = require('fs');

(async () => {
  console.log('🚀 Launching Auto-Crawler...');
  // Launch a visible browser so you can log in
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();
  const page = await context.newPage();

  console.log('👉 Please log in to practicecelpip.ca in the opened browser window.');
  console.log('⏳ Waiting for 60 seconds for you to log in...');
  
  await page.goto('https://practicecelpip.ca/sign-in');
  
  // Wait for 60 seconds to give the user time to log in
  await page.waitForTimeout(60000); 
  console.log('✅ 60 seconds passed. Starting the automated bulk scrape...');

  const allReadingTests = [];

  // Scrape Parts 1 to 4
  for (let part = 1; part <= 4; part++) {
    console.log(`\n🔍 Scanning Catalog for Reading Part ${part}...`);
    await page.goto(`https://practicecelpip.ca/practice-questions/reading/part-${part}`);
    await page.waitForTimeout(3000);

    // Find all test links for this part
    const testLinks = await page.evaluate((partNum) => {
      const links = Array.from(document.querySelectorAll('a[href*="/reading/part-' + partNum + '-"]'));
      return links.map(a => a.href);
    }, part);

    console.log(`Found ${testLinks.length} tests in Part ${part}.`);

    // Visit each test and extract data
    for (const link of testLinks) {
      console.log(`Scraping: ${link}`);
      await page.goto(link);
      await page.waitForTimeout(4000); // Wait for React to load the questions

      const testData = await page.evaluate(() => {
        const clean = el => (el?.innerText || el?.textContent || "").trim();
        
        // 1. Passage
        const passage = clean(document.querySelector("article, main")) || 
                        [...document.querySelectorAll("p")].map(clean).filter(Boolean).sort((a, b) => b.length - a.length)[0] || 
                        "";

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
        const title = document.title || "Reading Test";

        return { title, passage, questions };
      });

      if (testData.questions.length > 0 || testData.passage) {
        allReadingTests.push(testData);
      }
    }
  }

  // Save everything
  fs.writeFileSync('celpip_reading.json', JSON.stringify(allReadingTests, null, 2));
  console.log(`\n🎉 DONE! Bulk scraped ${allReadingTests.length} tests and saved to celpip_reading.json.`);
  
  await browser.close();
})();
