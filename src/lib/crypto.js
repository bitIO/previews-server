const crypto = require("crypto");

const dictionary = {};

function getHash(url) {
  const b64 = Buffer.from(url).toString("base64");
  if (dictionary[b64]) {
    return dictionary[b64];
  }
  const urlHashed = crypto.createHash("sha1").update(url).digest("hex");
  dictionary[b64] = urlHashed;
  return urlHashed;
}

module.exports = {
  getHash,
};
