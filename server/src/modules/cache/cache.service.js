import redisClient from "../../config/redis.js";

export const getCache = async (key) => {
  const data = await redisClient.get(key);

  if (!data) return null;

  return JSON.parse(data);
};

export const setCache = async (key, value, ttl = 300) => {
  await redisClient.set(key, JSON.stringify(value), {
    EX: ttl,
  });
};

export const deleteCache = async (key) => {
  await redisClient.del(key);
};