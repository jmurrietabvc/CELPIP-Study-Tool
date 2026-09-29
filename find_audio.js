const { chromium } = require('playwright');
const fs = require('fs');

(async () => {
  const browser = await chromium.launch();
  const context = await browser.newContext();
  const page = await context.newPage();

  console.log('Navigating to listening part-1-001...');
  await page.goto('https://practicecelpip.ca/practice-questions/listening/part-1-001', { waitUntil: 'networkidle' });
  await page.waitForTimeout(3000);
  
  const html = await page.content();
  fs.writeFileSync('listening_test.html', html);
  
  // Try to find audio sources
  const audioSources = await page.evaluate(() => {
     const audios = Array.from(document.querySelectorAll('audio, source, iframe'));
     return audios.map(a => a.src || a.currentSrc || a.outerHTML);
  });
  
  console.log('Audio elements found:', audioSources);

  await browser.close();
})();
