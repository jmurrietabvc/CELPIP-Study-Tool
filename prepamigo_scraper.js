const { chromium } = require('playwright');
const fs = require('fs');

(async () => {
  console.log('🚀 Launching PrepAmigo Auto-Crawler...');
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();
  const page = await context.newPage();

  console.log('👉 Please log in to prepamigo.com in the opened browser window.');
  console.log('👉 IMPORTANT: After logging in, please navigate to the list/catalog of Reading tests.');
  console.log('⏳ Waiting for 60 seconds for you to log in and reach the test list...');
  
  await page.goto('https://www.prepamigo.com/login'); // Or the main page
  
  await page.waitForTimeout(60000); 
  console.log('✅ 60 seconds passed. Scanning the current page for test links...');

  // Find all links that might be tests
  const testLinks = await page.evaluate(() => {
    // Look for links that contain 'test', 'reading', 'exam', 'practice'
    const links = Array.from(document.querySelectorAll('a[href]'));
    return links.map(a => a.href).filter(href => 
      href.includes('/reading') || href.includes('/test') || href.includes('/practice')
    );
  });

  // Remove duplicates
  const uniqueLinks = [...new Set(testLinks)];
  console.log(`Found ${uniqueLinks.length} potential test links:`, uniqueLinks);

  // We will just save these links to a file first so the AI can analyze them
  fs.writeFileSync('prepamigo_links.json', JSON.stringify(uniqueLinks, null, 2));
  
  console.log('Saved links to prepamigo_links.json. The AI will analyze the structure before proceeding.');
  await browser.close();
})();
