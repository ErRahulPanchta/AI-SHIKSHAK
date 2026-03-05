import express from "express";
import { corsMiddleware } from "./config/cors.js";
import helmet from "helmet";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import rateLimitMiddleware from "./middleware/rateLimit.middleware.js";
import errorMiddleware from "./middleware/error.middleware.js";
import { env } from "./config/env.js";

const app = express();

/* -------------------- Security Middleware -------------------- */

app.use(helmet());

app.use(corsMiddleware);

app.use(rateLimitMiddleware);

/* -------------------- Parsing Middleware -------------------- */

app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

/* -------------------- Logging -------------------- */

if (env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

/* -------------------- Health Route -------------------- */

app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Server is running",
  });
});

/* -------------------- Global Error Handler (Placeholder) -------------------- */

app.use(errorMiddleware);

export default app;