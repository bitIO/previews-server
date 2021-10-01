const fastify = require("fastify");
const path = require("path");
const { prepareFolder, prepareImagesFolder } = require("./lib/fs");
const { listPreviews, requestPreview } = require("./lib/preview");

function server(opts) {
  const app = fastify(opts);
  app.register(require("fastify-cors"), {});

  prepareImagesFolder();
  app.register(require("fastify-static"), {
    prefix: "/images/", // optional: default '/'
    root: path.join(__dirname, "..", "images"),
  });

  app.options("/api/previews", (request, reply) => {
    return { code: 204 };
  });
  app.post("/api/previews", async (request, reply) => {
    console.log(">>> requested preview", {
      body: request.body,
      headers: request.headers,
    });

    prepareFolder(request.body.url);
    const preview = await requestPreview(request.body.url);

    reply.header("Content-Type", "application/json");
    reply.send({
      code: 200,
      preview,
    });
    return;
  });

  app.get(
    "/api/previews",
    {
      query: {
        width: {
          type: "number",
        },
        height: {
          type: "number",
        },
        isMobile: {
          type: "boolean",
        },
        isLandscape: {
          type: "boolean",
        },
        deviceName: {
          type: "string",
        },
        url: {
          type: "string",
        },
      },
    },
    async (request, reply) => {
      console.log(">>> requested preview", {
        query: request.query,
        headers: request.headers,
      });
      const { url, width, height, isMobile, isLandscape, deviceName } =
        request.query;
      reply.header("Content-Type", "application/json");
      return {
        images: listPreviews({
          url,
          width,
          height,
          isMobile,
          isLandscape,
          deviceName,
        }),
      };
    }
  );

  app.get("/api/health", (request, reply) => {
    reply.header("Content-Type", "application/json");
    return {
      status: "ok",
    };
  });

  app.get(
    "/images/:urlId/:file",
    {
      params: {
        urlId: { type: "string" },
        file: { type: "string" },
      },
    },
    (request, reply) => {
      console.log(">>> requested file", {
        body: request.body,
        headers: request.headers,
        params: request.params,
      });
      reply.sendFile(`${request.params.urlId}/${request.params.file}`);
    }
  );

  return app;
}

module.exports = {
  server,
};
