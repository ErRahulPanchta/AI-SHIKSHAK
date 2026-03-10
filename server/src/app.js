import express from "express";
import { corsMiddleware } from "./config/cors.js";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import errorMiddleware from "./middleware/error.middleware.js";
import multerErrorHandler from "./middleware/multerError.middleware.js";
import { env } from "./config/env.js";

// Security
import helmetMiddleware from "./middleware/security/helmet.middleware.js";
// import mongoSanitizeMiddleware from "./middleware/security/mongoSanitize.middleware.js";
import { xssMiddleware } from "./middleware/security/xss.middleware.js";
import hppMiddleware from "./middleware/security/hpp.middleware.js";
import { apiLimiter } from "./middleware/security/rateLimit.middleware.js";

// Swagger
import { swaggerUi, swaggerSpec } from "./docs/swagger.js";

// Routes
import authRoutes from "./modules/auth/auth.routes.js";
import userRoutes from "./modules/user/user.routes.js";
import blogRoutes from "./modules/blog/blog.routes.js";
import categoryRoutes from "./modules/category/category.routes.js";
import commentRoutes from "./modules/comment/comment.routes.js";
import aiRoutes from "./modules/ai/ai.routes.js";

const app = express();

// Trust proxy (required for rate limiter + cookies in production)
app.set("trust proxy", 1);

// CORS
app.use(corsMiddleware);

// Security middlewares (disabled in tests)
if (env.NODE_ENV !== "test") {
  app.use(helmetMiddleware);
  app.use(apiLimiter);
}

// Body parsers
app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true }));

// Sanitization (disabled in tests)
if (env.NODE_ENV !== "test") {
  // app.use(mongoSanitizeMiddleware);
  app.use(xssMiddleware);
  app.use(hppMiddleware);
}

// Utilities
app.use(cookieParser());

// Logger
if (env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// Health check
app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Server is running",
  });
});

// Root route
app.get("/", (req, res) => {
  res.json({
    message: "AI SHIKSHAK API",
    docs: "/api/docs",
  });
});

// Swagger docs
app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/blogs", blogRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api", commentRoutes);
app.use("/api/ai", aiRoutes);

// Error handling
app.use(multerErrorHandler);
app.use(errorMiddleware);

export default app;