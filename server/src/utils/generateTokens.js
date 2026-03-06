import jwt from "jsonwebtoken";
import { env } from "../config/env.js";

export const generateAccessToken = (userId) => {
  return jwt.sign(
    { id: userId },
    env.JWT_ACCESS_SECRET,
    { expiresIn: env.JWT_ACCESS_EXPIRES }
  );
};

export const generateRefreshToken = (userId) => {
  return jwt.sign(
    { id: userId },
    env.JWT_REFRESH_SECRET,
    { expiresIn: env.JWT_REFRESH_EXPIRES }
  );
};