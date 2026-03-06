import jwt from "jsonwebtoken";
import Token from "./token.model.js";
import ApiError from "../../utils/ApiError.js";
import { generateAccessToken, generateRefreshToken } from "../../utils/generateTokens.js";
import { env } from "../../config/env.js";

const refreshTokenService = async (refreshToken) => {

  const payload = jwt.verify(refreshToken, env.JWT_REFRESH_SECRET);

  const storedToken = await Token.findOne({ token: refreshToken });

  if (!storedToken || storedToken.blacklisted) {
    throw new ApiError(401, "Invalid refresh token");
  }

  const userId = payload.id;

  /* rotation */

  storedToken.blacklisted = true;
  await storedToken.save();

  const newAccessToken = generateAccessToken(userId);
  const newRefreshToken = generateRefreshToken(userId);

  await Token.create({
    user: userId,
    token: newRefreshToken,
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
  });

  return {
    accessToken: newAccessToken,
    refreshToken: newRefreshToken
  };
};

export default {
  refreshTokenService
};