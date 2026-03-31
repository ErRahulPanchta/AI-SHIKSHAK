import dotenv from "dotenv";
import { z } from "zod";

// Load correct env file
if (process.env.NODE_ENV === "test") {
  dotenv.config({ path: ".env.test" });
} else if (process.env.NODE_ENV !== "production") {
  dotenv.config();
}

const isTest = process.env.NODE_ENV === "test";

const envSchema = z.object({
  NODE_ENV: z
    .enum(["development", "production", "test"])
    .default("development"),

  PORT: z
    .string()
    .default("8080")
    .transform((val) => Number(val)),

  MONGO_URI: isTest ? z.string().optional() : z.string().min(1),

  JWT_ACCESS_SECRET: z.string().min(10),
  JWT_REFRESH_SECRET: z.string().min(10),

  JWT_ACCESS_EXPIRES: z.string(),
  JWT_REFRESH_EXPIRES: z.string(),

  CLIENT_URL: z.string().url(),

  CLOUDINARY_CLOUD_NAME: z.string().optional(),
  CLOUDINARY_API_KEY: z.string().optional(),
  CLOUDINARY_API_SECRET: z.string().optional(),

  REDIS_URL: z.string().optional(),

  OPENAI_API_KEY: z.string().optional(),

  SMTP_HOST: isTest ? z.string().optional() : z.string(),
  SMTP_PORT: isTest ? z.string().optional() : z.string(),
  SMTP_USER: isTest ? z.string().optional() : z.string(),
  SMTP_PASS: isTest ? z.string().optional() : z.string(),
  BREVO_API_KEY: isTest ? z.string().optional() : z.string(),
  EMAIL_FROM: isTest ? z.string().optional() : z.string(),
  OTP_EXPIRE_MINUTES: z.string(),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error("Invalid Environment Variables");
  console.error(parsed.error.format());
  process.exit(1);
}

export const env = parsed.data;
