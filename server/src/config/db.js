import mongoose from "mongoose";
import { env } from "./env.js";

export const connectDB = async () => {
  try {

    if (mongoose.connection.readyState === 1) {
      return;
    }

    const conn = await mongoose.connect(env.MONGO_URI);

    if (env.NODE_ENV !== "test") {
      console.log(`MongoDB Connected: ${conn.connection.host}`);
    }

  } catch (error) {
    console.error("Database connection failed:", error);
    process.exit(1);
  }
};