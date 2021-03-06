const fs = require("fs");
const { join, resolve } = require("path");
const { getHash } = require("./crypto");
const { get, put } = require("./database");

function prepareImagesFolder(folderName = "images") {
  const folder = join(__dirname, "../..", folderName);
  console.log("Preparing images folder", folder);
  if (!fs.existsSync(folder)) {
    console.log("Folder does not exist. Creating:", folder);
    fs.mkdirSync(folder, { recursive: true });
  }
  console.log("Images folder ready");
}

function prepareFolder(url) {
  const record = get(url);
  if (!record) {
    put(url, {});
  }
  const folder = resolve(__dirname, `../../images/`, getHash(url));
  if (!fs.existsSync(folder)) {
    console.log("Folder: creating", folder);
    fs.mkdirSync(folder);
  } else {
    console.log("Folder: exists", folder);
  }
}

function getFolderForUrl(url) {
  return resolve(__dirname, `../../images/`, getHash(url));
}

function emptyFolderForUrl(url) {
  const folder = getFolderForUrl(url);
  console.log("Cleaning folder:", folder);
  const files = fs.readdirSync(folder);
  files.forEach((file) => {
    console.log("\t", `x ${file}`);
    fs.unlinkSync(resolve(folder, file));
  });
}

module.exports = {
  emptyFolderForUrl,
  getFolderForUrl,
  prepareFolder,
  prepareImagesFolder,
};
