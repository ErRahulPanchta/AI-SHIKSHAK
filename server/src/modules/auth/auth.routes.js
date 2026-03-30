import express from "express";
import {
  forgotPassword,
  login,
  logout,
  me,
  register,
  requestOtp,
  resetPassword,
  verifyOtp,
} from "./auth.controller.js";
import validate from "../../middleware/validation.middleware.js";
import { loginSchema, registerSchema } from "./auth.validation.js";
import { refresh } from "./refresh.controller.js";
import authMiddleware from "../../middleware/auth.middleware.js";
import { authLimiter } from "../../middleware/security/rateLimit.middleware.js";

const router = express.Router();

const skipLimiter =
  process.env.NODE_ENV !== "production" ? (req, res, next) => next() : authLimiter;

  /**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Authentication APIs
 */

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Auth]
 *     responses:
 *       201:
 *         description: User registered successfully
 */
router.post("/register", validate(registerSchema), register);
router.post("/request-otp", requestOtp);
router.post("/verify-otp", verifyOtp);

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Login user
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: Login successful
 */
router.post("/login", skipLimiter, validate(loginSchema), login);

router.post("/refresh", refresh);

router.post("/logout", logout);

/**
 * @swagger
 * /auth/me:
 *   get:
 *     summary: Get current user
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: User data
 */
router.get("/me", authMiddleware, me);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);

export default router;
