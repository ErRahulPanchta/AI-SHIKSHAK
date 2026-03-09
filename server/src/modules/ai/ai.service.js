import OpenAI from "openai";
import { env } from "../../config/env.js";
import {
  summarizePrompt,
  tagPrompt,
  explainPrompt,
  chatbotPrompt,
} from "./ai.prompts.js";

const openai = new OpenAI({
  apiKey: env.OPENAI_API_KEY,
});

const askAI = async (prompt) => {
  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "user",
        content: prompt,
      },
    ],
  });

  return response.choices[0].message.content;
};

export const summarizeBlog = async (content) => {
  const prompt = summarizePrompt(content);
  return askAI(prompt);
};

export const generateTags = async (title, content) => {
  const prompt = tagPrompt(title, content);
  return askAI(prompt);
};

export const explainConcept = async (topic) => {
  const prompt = explainPrompt(topic);
  return askAI(prompt);
};

export const chatWithAI = async (message) => {
  const prompt = chatbotPrompt(message);
  return askAI(prompt);
};