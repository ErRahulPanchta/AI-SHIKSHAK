import User from "../user/user.model.js";
import ApiError from "../../utils/ApiError.js";
import {
  generateAccessToken,
  generateRefreshToken,
} from "../../utils/generateTokens.js";
import Token from "./token.model.js";
import OTP from "./otp.model.js";
import otpService from "./otp.service.js";

//register user
const registerUser = async (data) => {
  const { name, email, password } = data;

  const normalizedEmail = email.toLowerCase();

  const existingUser = await User.findOne({ email: normalizedEmail });
  if (existingUser) {
    throw new ApiError(409, "User already exists");
  }

  const otpRecord = await OTP.findOne({ email: normalizedEmail });

  if (!otpRecord) {
    throw new ApiError(400, "OTP not requested for this email");
  }

  if (!otpRecord.verified) {
    throw new ApiError(400, "Email not verified");
  }

  if (otpRecord.expiresAt < new Date()) {
    throw new ApiError(400, "OTP expired");
  }

  const user = await User.create({
    name,
    email: normalizedEmail,
    password,
    isEmailVerified: true,
  });

  await OTP.deleteOne({ email: normalizedEmail });

  const userResponse = user.toObject();
  delete userResponse.password;

  return userResponse;
};

//login user
const loginUser = async (data) => {
  const { email, password } = data;

  const normalizedEmail = email.toLowerCase();

  const user = await User.findOne({ email: normalizedEmail }).select(
    "+password",
  );

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  const validPassword = await user.comparePassword(password);

  if (!validPassword) {
    throw new ApiError(401, "Invalid credentials");
  }

  const accessToken = generateAccessToken(user._id);
  const refreshToken = generateRefreshToken(user._id);

  await Token.create({
    user: user._id,
    token: refreshToken,
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
  });

  const userResponse = user.toObject();
  delete userResponse.password;

  return {
    user: userResponse,
    accessToken,
    refreshToken,
  };
};

//logout user
const logoutUser = async (refreshToken) => {
  const tokenDoc = await Token.findOne({ token: refreshToken });

  if (!tokenDoc) {
    throw new ApiError(404, "Token not found");
  }

  tokenDoc.blacklisted = true;
  await tokenDoc.save();
};

//get user
const getMe = async (userId) => {
  const user = await User.findById(userId);

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  return user;
};
// forgot password
const forgotPassword = async (email) => {
  const normalizedEmail = email.toLowerCase();

  const user = await User.findOne({ email: normalizedEmail });

  if (!user) {
    throw new ApiError(404, "User not found");
  }
  await otpService.requestOTP(normalizedEmail, "reset");
};

//reset password
const resetPassword = async (email, newPassword) => {
  const normalizedEmail = email.toLowerCase();

  const record = await OTP.findOne({
    email: normalizedEmail,
    type: "reset",
  });

  if (!record) {
    throw new ApiError(400, "OTP not requested");
  }

  if (!record.verified) {
    throw new ApiError(400, "OTP not verified");
  }

  if (record.expiresAt < new Date()) {
    throw new ApiError(400, "OTP expired");
  }

  const user = await User.findOne({ email: normalizedEmail });

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  user.password = newPassword;
  await user.save();

  await OTP.deleteOne({ email: normalizedEmail, type: "reset" });
};

export default {
  registerUser,
  loginUser,
  logoutUser,
  getMe,
  forgotPassword,
  resetPassword,
};
