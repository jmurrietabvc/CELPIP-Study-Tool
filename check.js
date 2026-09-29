const { chromium } = require('playwright');
const fs = require('fs');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  const responses = [];
  page.on('response', async (response) => {
    if (response.url().includes('practicecelpip.ca') && response.request().resourceType() === 'fetch') {
      try {
        const text = await response.text();
        responses.push({ url: response.url(), text: text.substring(0, 1500) });
      } catch (e) {}
    }
  });

  await page.goto('https://practicecelpip.ca/practice-questions/reading/part-1');
  await page.waitForTimeout(5000); // wait for loads
  
  fs.writeFileSync('responses_part1.json', JSON.stringify(responses, null, 2));
  
  const content = await page.content();
  fs.writeFileSync('part1_content.html', content);
  
  await browser.close();
  console.log('Done');
})();
