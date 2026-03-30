import { getRedisClient } from "../../config/redis.js";

export const getCache = async (key) => {
  try {
    const client = getRedisClient(); 

    if (!client) return null;

    const data = await client.get(key);

    if (!data) return null;

    return JSON.parse(data);
  } catch (error) {
    console.error("Redis getCache error:", error.message);
    return null; // fail silently
  }
};

export const setCache = async (key, value, ttl = 300) => {
  try {
    const client = getRedisClient(); // ✅ FIX

    if (!client) return;

    await client.set(key, JSON.stringify(value), {
      EX: ttl, // seconds
    });
  } catch (error) {
    console.error("Redis setCache error:", error.message);
  }
};

export const deleteCache = async (key) => {
  try {
    const client = getRedisClient(); // ✅ FIX

    if (!client) return;

    await client.del(key);
  } catch (error) {
    console.error("Redis deleteCache error:", error.message);
  }
};

export const deleteCacheByPattern = async (pattern) => {
  try {
    const client = getRedisClient();

    if (!client) return;

    const keys = [];

    for await (const key of client.scanIterator({
      MATCH: pattern,
      COUNT: 100,
    })) {
      keys.push(key);
    }

    if (keys.length > 0) {
      await client.del(keys);
    }
  } catch (error) {
    console.error("Redis deleteCacheByPattern error:", error.message);
  }
};