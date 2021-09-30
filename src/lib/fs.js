const fs = require("fs");
const { resolve } = require("path");
const { getHash } = require("./crypto");
const { get, put } = require("./database");

function prepareFolder(url) {
  const record = get(url);
  if (!record) {
    put(url, {});
  }
  const folder = resolve(__dirname, `../images/`, getHash(url));
  if (!fs.existsSync(folder)) {
    console.log("Folder: creating", folder);
    fs.mkdirSync(folder);
  } else {
    console.log("Folder: exists", folder);
  }
}

function getFolderForUrl(url) {
  return resolve(__dirname, `../images/`, getHash(url));
}

module.exports = {
  getFolderForUrl,
  prepareFolder,
};
