import { getRedisClient } from "../../config/redis.js";

export const getCache = async (key) => {
  try {
    const client = getRedisClient();

    if (!client) return null;

    const data = await client.get(key);

    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error("Redis getCache error:", error.message);
    return null;
  }
};

export const setCache = async (key, value, ttl = 300) => {
  try {
    const client = getRedisClient();

    if (!client) return;

    await client.set(
      key,
      JSON.stringify(value),
      { EX: ttl }
    );
  } catch (error) {
    console.error("Redis setCache error:", error.message);
  }
};

export const deleteCache = async (key) => {
  try {
    const client = getRedisClient();

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

    if (keys.length) {
      await client.del(keys);
    }
  } catch (error) {
    console.error(
      "Redis deleteCacheByPattern error:",
      error.message
    );
  }
};