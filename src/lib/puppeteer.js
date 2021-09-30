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
}) {
  const page = await browser.newPage();
  await page.setViewport({ width, height, isMobile, isLandscape });
  await page.goto(url, { waitUntil: "networkidle2" });
  await page.screenshot({ path });
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
