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
      url: env.REDIS_URL, // redis://default:password@host:port

      socket: {
        // prevent infinite reconnect loops on bad connections
        reconnectStrategy: (retries) => {
          if (retries > 5) {
            logger.error("Redis reconnect limit reached.");
            return false; // stop retrying
          }

          return Math.min(retries * 500, 3000);
        },
      },
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
      logger.error("Redis error:", err.message);
      console.error("REDIS ERROR RAW:", err);
    });

    await redisClient.connect();

    return redisClient;
  } catch (error) {
    logger.warn("Redis unavailable. Continuing without cache.");
    logger.error("Redis connection failed:", error.message);
    return null;
  }
};

export const getRedisClient = () => {
  if (!redisClient || !redisClient.isOpen) {
    return null;
  }

  return redisClient;
};