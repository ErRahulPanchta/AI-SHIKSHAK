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

    redisClient.on("ready", () => {
      logger.info("Redis ready to use");
    });

    redisClient.on("reconnecting", () => {
      logger.warn("Redis reconnecting...");
    });

    redisClient.on("end", () => {
      logger.warn("Redis connection closed");
    });

    redisClient.on("error", (err) => {
      logger.error("Redis error FULL:", err);
      console.error("REDIS ERROR RAW:", err);
      console.error("REDIS ERROR MESSAGE:", err?.message);
    });

    await redisClient.connect();

    return redisClient;
  } catch (error) {
    logger.warn("Redis unavailable. Continuing without cache.");
    logger.error("Redis connection failed:", error);
    console.error("REDIS CATCH ERROR:", error);
    console.error("REDIS CATCH MESSAGE:", error?.message);
    return null;
  }
};

export const getRedisClient = () => {
  if (!redisClient) {
    logger.warn(" Redis not initialized yet");
  }
  return redisClient;
};
