import express from "express";
import { login, register } from "./auth.controller.js";
import validate from "../../middleware/validation.middleware.js";
import { loginSchema, registerSchema } from "./auth.validation.js";

const router = express.Router();

router.post("/register", validate(registerSchema), register);
router.post("/login", validate(loginSchema), login);

export default router;
