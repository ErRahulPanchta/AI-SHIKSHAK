import { createClient } from "redis";
import { env } from "./env.js";
import logger from "../utils/logger.js";

let redisClient = null;

export const connectRedis = async () => {
  if (!env.REDIS_URL) {
    logger.warn("Redis URL not provided. Skipping Redis connection.");
    return null;
  }

  try {
    redisClient = createClient({
      url: env.REDIS_URL,
    });

    redisClient.on("connect", () => {
      logger.info("Redis connected");
    });

    redisClient.on("error", (err) => {
      logger.error("Redis error:", err.message);
    });

    await redisClient.connect();

    return redisClient;

  } catch (error) {
    logger.warn("Redis unavailable. Continuing without cache.");
    return null;
  }
};

export default redisClient;