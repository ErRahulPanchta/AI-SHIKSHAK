import express from "express";
import { corsMiddleware } from "./config/cors.js";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import errorMiddleware from "./middleware/error.middleware.js";
import multerErrorHandler from "./middleware/multerError.middleware.js";
import { env } from "./config/env.js";

// Security
import helmetMiddleware from "./middleware/security/helmet.middleware.js";
import mongoSanitizeMiddleware from "./middleware/security/mongoSanitize.middleware.js";
import { xssMiddleware } from "./middleware/security/xss.middleware.js";
import hppMiddleware from "./middleware/security/hpp.middleware.js";
import { apiLimiter } from "./middleware/security/rateLimit.middleware.js";

//swagger
import { swaggerUi, swaggerSpec } from "./docs/swagger.js";

// Routes
import authRoutes from "./modules/auth/auth.routes.js";
import userRoutes from "./modules/user/user.routes.js";
import blogRoutes from "./modules/blog/blog.routes.js";
import categoryRoutes from "./modules/category/category.routes.js";
import commentRoutes from "./modules/comment/comment.routes.js";

const app = express();

//trust proxy
app.set("trust proxy", 1);

//security layer
app.use(corsMiddleware);
app.use(helmetMiddleware);
app.use(apiLimiter);

//body parser
app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true }));

//sanitization
// app.use(mongoSanitizeMiddleware);
app.use(xssMiddleware);
app.use(hppMiddleware);

//utilities
app.use(cookieParser());

if (env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

//health check
app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Server is running",
  });
});

app.get("/", (req, res) => {
  res.json({
    message: "AI SHIKSHAK API",
    docs: "/api/docs",
  });
});

//swagger
app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

//routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/blogs", blogRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api", commentRoutes);

//error handling
app.use(multerErrorHandler);
app.use(errorMiddleware);

export default app;
