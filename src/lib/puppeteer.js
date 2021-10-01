const puppeteer = require("puppeteer");

let browser;

async function startBrowser() {
  if (!browser) {
    browser = await puppeteer.launch();
  }
}

async function generateScreenshot({
  url,
  width,
  height,
  isMobile,
  isLandscape,
  path,
  cacheEnabled,
  fullPage,
  captureBeyondViewport,
  waitUntil,
}) {
  const page = await browser.newPage();
  await page.setCacheEnabled(cacheEnabled || false);
  await page.setViewport({ width, height, isMobile, isLandscape });
  await page.goto(url, { waitUntil: waitUntil ? waitUntil : "networkidle0" });
  await page.screenshot({
    path,
    fullPage: fullPage || true,
    captureBeyondViewport: captureBeyondViewport || true,
  });
}

async function stopBrowser() {
  if (browser) {
    await browser.close();
    browser = undefined;
  }
}

module.exports = {
  startBrowser,
  generateScreenshot,
  stopBrowser,
};
