import { createClient } from "redis";
import logger from "../utils/logger.js";

let redisClient = null;

export const connectRedis = async () => {
  if (!process.env.REDIS_URL) {
    logger.warn("Redis URL not provided. Caching disabled.");
    return null;
  }

  redisClient = createClient({
    url: process.env.REDIS_URL
  });

  redisClient.on("connect", () => {
    logger.info("Redis connected");
  });

  redisClient.on("error", (err) => {
    logger.error("Redis error:", err.message);
  });

  try {
    await redisClient.connect();
  } catch (err) {
    logger.warn("Redis unavailable, continuing without cache.");
  }

  return redisClient;
};

export default redisClient;