import { useState } from "react";
import api from "../services/api";
import toast from "react-hot-toast";

export const useAI = () => {
  const [loading, setLoading] = useState(false);

  const request = async (url, body) => {
    try {
      setLoading(true);
      const res = await api.post(url, body);
      return res.data.data;
    } catch (err) {
      console.error("AI ERROR:", err);

      if (err.response?.status === 429) {
        toast.error("AI limit reached. Try again later.");
      } else {
        toast.error(
          err.response?.data?.message || "AI request failed"
        );
      }

      return null;
    } finally {
      setLoading(false);
    }
  };

  const handleGenerate = async (prompt) => {
    const res = await request("/ai/chat", { message: prompt });
    return res?.reply || "";
  };

  const handleSummarize = async (content) => {
    const res = await request("/ai/summarize", { content });
    return res?.summary || "";
  };

  const handleTags = async (title, content) => {
    const res = await request("/ai/tags", { title, content });

    try {
      return JSON.parse(res?.tags || "[]");
    } catch {
      return [];
    }
  };

  const handleExplain = async (topic) => {
    const res = await request("/ai/explain", { topic });
    return res?.explanation || "";
  };

  return {
    loading,
    handleGenerate,
    handleSummarize,
    handleTags,
    handleExplain,
  };
};