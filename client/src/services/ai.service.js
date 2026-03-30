import api from "./api";

export const summarizeContent = async (content) => {
  const { data } = await api.post("/api/ai/summarize", { content });
  return data.data; // because ApiResponse wrapper
};

export const generateTagsAI = async (title, content) => {
  const { data } = await api.post("/api/ai/tags", { title, content });
  return data.data;
};

export const generateContent = async (topic) => {
  const { data } = await api.post("/api/ai/explain", { topic });
  return data.data;
};