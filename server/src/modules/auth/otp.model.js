import mongoose from "mongoose";

const otpSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    lowercase: true,
  },

  otp: {
    type: String,
    required: true,
  },

  type: {
    type: String,
    enum: ["verify", "reset"],
    required: true,
  },

  expiresAt: {
    type: Date,
    required: true,
  },

  verified: {
    type: Boolean,
    default: false,
  },
});

export default mongoose.model("OTP", otpSchema);