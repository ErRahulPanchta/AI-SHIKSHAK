import api from "./api";

// Chat (AI Generator)
export const chatAI = async (message) => {
  const { data } = await api.post("/api/ai/chat", { message });
  return data.data;
};

// Summarize
export const summarizeAI = async (content) => {
  const { data } = await api.post("/api/ai/summarize", { content });
  return data.data;
};

// Generate Tags
export const generateTagsAI = async (title, content) => {
  const { data } = await api.post("/api/ai/tags", { title, content });
  return data.data;
};

// Explain Topic
export const explainAI = async (topic) => {
  const { data } = await api.post("/api/ai/explain", { topic });
  return data.data;
};