const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.setViewport({ width: 375, height: 667, deviceScaleFactor: 2 });
  
  // Wait to navigate
  await page.goto('http://127.0.0.1:8081/index.html', { waitUntil: 'networkidle2' });
  
  // Wait for 1 second just in case
  await new Promise(r => setTimeout(r, 1000));
  
  // We want to capture only the top portion of the navbar
  await page.screenshot({ path: 'navbar-mobile-fix.png', clip: {x: 0, y: 0, width: 375, height: 100} });
  await browser.close();
  console.log("Screenshot saved at navbar-mobile-fix.png");
})();
