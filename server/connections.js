const knex = require("knex");
const redis = require("redis");

const postgresClient = knex({
  client: "pg",
  connection: process.env.POSTGRES_URI
});

const redisClient = redis.createClient({
  url: process.env.REDIS_URI
});

module.exports = {
  postgresClient,
  redisClient
};
