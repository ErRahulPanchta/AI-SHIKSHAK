import rateLimit from "express-rate-limit";

const isTest = process.env.NODE_ENV === "test";

export const authLimiter = isTest
  ? (req, res, next) => next()
  : rateLimit({
      windowMs: 15 * 60 * 1000,
      max: 5,
      message: "Too many login attempts. Try again later.",
    });

export const apiLimiter = isTest
  ? (req, res, next) => next()
  : rateLimit({
      windowMs: 15 * 60 * 1000,
      max: 100,
    });