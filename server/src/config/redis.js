import { createClient } from "redis";
import { env } from "./env.js";
import logger from "../utils/logger.js";

const redisClient = createClient({
  url: env.REDIS_URL,
});

redisClient.on("connect", () => {
  logger.info("Redis connected");
});

redisClient.on("error", (err) => {
  logger.error("Redis error:", err);
});

await redisClient.connect();

export default redisClient;
