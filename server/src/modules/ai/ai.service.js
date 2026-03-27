import OpenAI from "openai";
import { env } from "../../config/env.js";
import {
  summarizePrompt,
  tagPrompt,
  explainPrompt,
  chatbotPrompt,
} from "./ai.prompts.js";

let openai = null;

const getOpenAI = () => {
  if (env.NODE_ENV === "test") {
    return null;
  }

  if (!openai) {
    openai = new OpenAI({
      apiKey: env.OPENAI_API_KEY,
    });
  }

  return openai;
};

const askAI = async (prompt) => {
  try {
    const client = getOpenAI();

    if (!client) {
      return "AI service unavailable in this environment.";
    }

    const response = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
    });

    return response.choices?.[0]?.message?.content || "";

  } catch (error) {
    console.error("AI ERROR:", {
      message: error?.message,
      status: error?.status,
      code: error?.code,
    });

    if (error?.status === 429) {
      return "⚠️ AI limit reached. Please try again later.";
    }

    if (error?.status === 401) {
      return "⚠️ AI configuration error. Contact admin.";
    }

    return "⚠️ AI service temporarily unavailable.";
  }
};

export const summarizeBlog = async (content) => {
  const prompt = summarizePrompt(content);
  return askAI(prompt);
};

export const generateTags = async (title, content) => {
  const prompt = tagPrompt(title, content);
  const result = await askAI(prompt);

  try {
    return JSON.stringify(JSON.parse(result)); 
  } catch {
    return "[]"; 
  }
};

export const explainConcept = async (topic) => {
  const prompt = explainPrompt(topic);
  return askAI(prompt);
};

export const chatWithAI = async (message) => {
  const prompt = chatbotPrompt(message);
  return askAI(prompt);
};