const { server } = require("./server");

async function start() {
  const app = server({
    // https://github.com/fastify/fastify-cors/issues/20#issuecomment-835203220
    exposeHeadRoutes: true,
    logger: {
      prettyPrint: true,
    },
  });
  try {
    await app.listen(3001);
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
}

start();
