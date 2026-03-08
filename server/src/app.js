import express from "express";
import { corsMiddleware } from "./config/cors.js";
import helmet from "helmet";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import rateLimitMiddleware from "./middleware/rateLimit.middleware.js";
import errorMiddleware from "./middleware/error.middleware.js";
import { env } from "./config/env.js";
import authRoutes from "./modules/auth/auth.routes.js";
import userRoutes from "./modules/user/user.routes.js";
import blogRoutes from "./modules/blog/blog.routes.js";
import categoryRoutes from "./modules/category/category.routes.js";
import commentRoutes from "./modules/comment/comment.routes.js";

import multerErrorHandler from "./middleware/multerError.middleware.js";

const app = express();

app.use(helmet());
app.use(corsMiddleware);
app.use(rateLimitMiddleware);

app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

if (env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Server is running",
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/blogs", blogRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api", commentRoutes);

app.use(errorMiddleware);
app.use(multerErrorHandler);

export default app;
