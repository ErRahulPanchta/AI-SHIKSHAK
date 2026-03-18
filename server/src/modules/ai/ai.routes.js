import express from "express";
import {
  summarize,
  generateTags,
  explain,
  chat,
} from "./ai.controller.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: AI
 *   description: AI APIs
 */

/**
 * @swagger
 * /ai/summarize:
 *   post:
 *     summary: Summarize content
 *     tags: [AI]
 *     responses:
 *       200:
 *         description: Summary generated
 */
router.post("/summarize", summarize);
router.post("/tags", generateTags);
router.post("/explain", explain);
router.post("/chat", chat);

export default router;