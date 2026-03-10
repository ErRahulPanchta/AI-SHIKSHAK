import dotenv from "dotenv";
import { z } from "zod";

dotenv.config({
  path: process.env.NODE_ENV === "test" ? ".env.test" : ".env",
});

const envSchema = z.object({
  NODE_ENV: z
    .enum(["development", "production", "test"])
    .default("development"),

  PORT: z
    .string()
    .default("8080")
    .transform((val) => Number(val)),

  MONGO_URI: z.string().min(1),
  JWT_ACCESS_SECRET: z.string().min(10),
  JWT_REFRESH_SECRET: z.string().min(10),
  JWT_ACCESS_EXPIRES: z.string(),
  JWT_REFRESH_EXPIRES: z.string(),
  CLIENT_URL: z.string().url(),
  CLOUDINARY_CLOUD_NAME: z.string(),
  CLOUDINARY_API_KEY: z.string(),
  CLOUDINARY_API_SECRET: z.string(),
  REDIS_URL: z.string(),
  OPENAI_API_KEY: z.string(),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error("Invalid Environment Variables");
  console.error(parsed.error.format());
  process.exit(1);
}

export const env = parsed.data;
