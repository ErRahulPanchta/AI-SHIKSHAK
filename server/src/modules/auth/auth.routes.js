import express from "express";
import { register } from "./auth.controller.js";
import validate from "../../middleware/validation.middleware.js";
import { registerSchema } from "./auth.validation.js";

const router = express.Router();

router.post("/register", validate(registerSchema), register);

export default router;
