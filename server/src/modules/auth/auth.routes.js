import express from "express";
import { login, logout, me, register } from "./auth.controller.js";
import validate from "../../middleware/validation.middleware.js";
import { loginSchema, registerSchema } from "./auth.validation.js";
import { refresh } from "./refresh.controller.js";
import authMiddleware from "../../middleware/auth.middleware.js";
import { authLimiter } from "../../middleware/security/rateLimit.middleware.js";

const router = express.Router();

const skipLimiter =
  process.env.NODE_ENV === "test" ? (req, res, next) => next() : authLimiter;

router.post("/register", validate(registerSchema), register);
router.post("/login", skipLimiter, validate(loginSchema), login);

router.post("/refresh", refresh);

router.post("/logout", logout);

router.get("/me", authMiddleware, me);

export default router;
