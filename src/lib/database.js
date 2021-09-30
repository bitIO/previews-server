const { getHash } = require("./crypto");

const database = {};

function get(url) {
  const urlHashed = getHash(url);
  return (
    database[urlHashed] || {
      url,
      urlHashed,
      images: [],
    }
  );
}

function put({ url, images, updated }) {
  try {
    const urlHashed = getHash(url);

    database[urlHashed] = Object.assign(get(url), {
      url,
      urlHashed,
      images: images || [],
      updated: updated || new Date(),
    });
    console.log("Record updated", database[urlHashed]);
  } catch (error) {
    console.error("Error updating record", error);
  }
}

module.exports = {
  get,
  put,
};
