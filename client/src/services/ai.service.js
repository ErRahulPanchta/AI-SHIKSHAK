import api from "./api";

export const summarizeContent = async (content) => {
  const { data } = await api.post("/ai/summarize", { content });
  return data.data; // because ApiResponse wrapper
};

export const generateTagsAI = async (title, content) => {
  const { data } = await api.post("/ai/tags", { title, content });
  return data.data;
};

export const generateContent = async (topic) => {
  const { data } = await api.post("/ai/explain", { topic });
  return data.data;
};