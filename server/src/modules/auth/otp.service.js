import OTP from "./otp.model.js";
import { generateOTP } from "../../utils/generateOtp.js";
import { sendOTPEmail } from "./email.service.js";
import User from "../user/user.model.js";
import ApiError from "../../utils/ApiError.js";

const requestOTP = async (email, type = "verify") => {
  const normalizedEmail = email.toLowerCase();

  const user = await User.findOne({ email: normalizedEmail });

  if (type === "verify" && user) {
    throw new ApiError(409, "User already registered");
  }

  if (type === "reset" && !user) {
    throw new ApiError(404, "User not found");
  }

  const otp = generateOTP();
  const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

  await OTP.findOneAndUpdate(
    { email: normalizedEmail, type },
    { email: normalizedEmail, otp, expiresAt, verified: false, type },
    { upsert: true, returnDocument: "after" },
  );

  await sendOTPEmail(normalizedEmail, otp, type);
};

const verifyOTP = async (email, otp, type) => {
  const normalizedEmail = email.toLowerCase();

  if (!type) {
    throw new Error("OTP type is required");
  }

  const record = await OTP.findOne({
    email: normalizedEmail,
    type,
  });

  if (!record) throw new Error("OTP not requested");

  if (record.expiresAt < new Date()) {
    throw new Error("OTP expired");
  }

  if (record.otp.toString() !== otp.toString()) {
    throw new Error("Invalid OTP");
  }

  record.verified = true;
  await record.save();
};

export default { requestOTP, verifyOTP };
