const { chromium } = require('playwright');
const fs = require('fs');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  await page.goto('https://practicecelpip.ca/practice-questions/reading/part-1');
  await page.waitForTimeout(5000); // Wait for rendering
  
  // Scrape everything from DOM
  const data = await page.evaluate(() => {
    const headings = Array.from(document.querySelectorAll('h3, h4, .text-text-secondary, label, button'));
    return headings.map(el => ({ tag: el.tagName, className: el.className, text: el.innerText }));
  });
  
  fs.writeFileSync('dom_elements.json', JSON.stringify(data, null, 2));
  await browser.close();
  console.log('DOM Extracted');
})();
