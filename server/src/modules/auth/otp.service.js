import OTP from "./otp.model.js";
import { generateOTP } from "../../utils/generateOtp.js";
import { sendOTPEmail } from "./email.service.js";

const requestOTP = async (email, type = "verify") => {
  const otp = generateOTP();

  const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

  await OTP.findOneAndUpdate(
    { email, type },
    { otp, expiresAt, verified: false },
    { upsert: true, returnDocument: "after" },
  );

  await sendOTPEmail(email, otp);
};

const verifyOTP = async (email, otp, type = "verify") => {
  const record = await OTP.findOne({ email, type });

  if (!record) throw new Error("OTP not requested");

  if (record.expiresAt < new Date())
    throw new Error("OTP expired");

  if (record.otp !== otp)
    throw new Error("Invalid OTP");

  record.verified = true;
  await record.save();
};

export default { requestOTP, verifyOTP };
