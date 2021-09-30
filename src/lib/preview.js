const { get, put } = require("./database");
const { getFolderForUrl } = require("./fs");
const {
  startBrowser,
  generateScreenshot,
  stopBrowser,
} = require("./puppeteer");

const dimensionsDefault = [
  {
    width: 414,
    height: 736,
    isMobile: true,
    isLandscape: false,
    deviceName: "iPhone-6-7-8-plus",
  },
  {
    width: 736,
    height: 736,
    isMobile: true,
    isLandscape: true,
    deviceName: "iPhone-6-7-8-plus",
  },
  {
    width: 375,
    height: 812,
    isMobile: true,
    isLandscape: false,
    deviceName: "iPhone-X",
  },
  {
    width: 812,
    height: 375,
    isMobile: true,
    isLandscape: true,
    deviceName: "iPhone-X",
  },
  {
    width: 768,
    height: 1024,
    isMobile: true,
    isLandscape: false,
    deviceName: "iPad",
  },
  {
    width: 1024,
    height: 768,
    isMobile: true,
    isLandscape: true,
    deviceName: "iPad",
  },
  {
    width: 1024,
    height: 1366,
    isMobile: true,
    isLandscape: false,
    deviceName: "iPad Pro",
  },
  {
    width: 1366,
    height: 1024,
    isMobile: true,
    isLandscape: true,
    deviceName: "iPad Pro",
  },
  {
    width: 1440,
    height: 764,
    isMobile: false,
    isLandscape: false,
    deviceName: "laptop",
  },
];

async function requestPreview(url) {
  const record = get(url);
  if (record.updated && record.images.length > 0) {
    return record;
  }

  await startBrowser();

  const folder = getFolderForUrl(url);
  const promises = dimensionsDefault.map(
    async ({ deviceName, height, isLandscape, isMobile, width }) => {
      const fileName = `${deviceName}-${width}x${height}${
        isMobile ? "-mobile" : ""
      }${isLandscape ? "-landscape" : ""}.png`;
      const path = `${folder}/${fileName}`;
      const pathRelative = path.split("/").slice(-2).join("/");

      await generateScreenshot({
        url,
        height,
        isLandscape,
        isMobile,
        width,
        path,
      });

      const entry = record.images.find(
        (item) => item.path === `/images/${pathRelative}`
      );
      if (!entry) {
        record.images.push({
          deviceName,
          height,
          isLandscape,
          isMobile,
          path: `/images/${pathRelative}`,
          width,
        });
      }
    }
  );
  await Promise.all(promises);
  await stopBrowser();

  put({ url, ...record });
  return get(url);
}

function listPreviews({
  url,
  width,
  height,
  isMobile,
  isLandscape,
  deviceName,
}) {
  const record = get(url);
  // TODO: filter by
  return record;
}

module.exports = {
  dimensionsDefault,
  requestPreview,
  listPreviews,
};
