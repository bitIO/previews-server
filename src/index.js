const { server } = require("./server");

async function start() {
  const app = server({
    // https://github.com/fastify/fastify-cors/issues/20#issuecomment-835203220
    exposeHeadRoutes: true,
    logger: true,
  });
  try {
    await app.listen(process.env.PORT || 3001, "0.0.0.0");
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
}

start();
