import express from "express";
import {
  summarize,
  generateTags,
  explain,
  chat,
} from "./ai.controller.js";

const router = express.Router();

router.post("/summarize", summarize);
router.post("/tags", generateTags);
router.post("/explain", explain);
router.post("/chat", chat);

export default router;