import asyncHandler from "../../utils/asyncHandler.js";
import ApiResponse from "../../utils/ApiResponse.js";
import * as aiService from "./ai.service.js";

export const summarize = asyncHandler(async (req, res) => {
  const { content } = req.body;

  const summary = await aiService.summarizeBlog(content);

  res.json(new ApiResponse(200, { summary }));
});

export const generateTags = asyncHandler(async (req, res) => {
  const { title, content } = req.body;

  const tags = await aiService.generateTags(title, content);

  res.json(new ApiResponse(200, { tags }));
});

export const explain = asyncHandler(async (req, res) => {
  const { topic } = req.body;

  const explanation = await aiService.explainConcept(topic);

  res.json(new ApiResponse(200, { explanation }));
});

export const chat = asyncHandler(async (req, res) => {
  const { message } = req.body;

  const reply = await aiService.chatWithAI(message);

  res.json(new ApiResponse(200, { reply }));
});