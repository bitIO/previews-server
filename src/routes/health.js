function getHealth(request, reply) {
  reply.header("Content-Type", "application/json");
  return {
    status: "ok",
  };
}

module.exports = {
  getHealth,
};
