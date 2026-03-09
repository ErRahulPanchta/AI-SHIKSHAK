import redisClient from "../../config/redis.js";

/**
 * Get cached value
 */
export const getCache = async (key) => {
  if (!redisClient) return null;

  try {
    const data = await redisClient.get(key);

    if (!data) return null;

    return JSON.parse(data);
  } catch (error) {
    console.error("Redis getCache error:", error.message);
    return null;
  }
};

/**
 * Set cache value
 */
export const setCache = async (key, value, ttl = 300) => {
  if (!redisClient) return;

  try {
    await redisClient.set(key, JSON.stringify(value), {
      EX: ttl,
    });
  } catch (error) {
    console.error("Redis setCache error:", error.message);
  }
};

/**
 * Delete cache key
 */
export const deleteCache = async (key) => {
  if (!redisClient) return;

  try {
    await redisClient.del(key);
  } catch (error) {
    console.error("Redis deleteCache error:", error.message);
  }
};