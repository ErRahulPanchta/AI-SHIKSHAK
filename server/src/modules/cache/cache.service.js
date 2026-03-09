import redisClient from "../../config/redis.js";

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

export const deleteCache = async (key) => {
  if (!redisClient) return;

  try {
    await redisClient.del(key);
  } catch (error) {
    console.error("Redis deleteCache error:", error.message);
  }
};