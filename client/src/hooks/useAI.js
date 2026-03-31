import { useState } from "react";
import toast from "react-hot-toast";
import {
  chatAI,
  summarizeAI,
  generateTagsAI,
  explainAI,
} from "../services/ai.service";

export const useAI = () => {
  const [loading, setLoading] = useState(false);

  const handleRequest = async (fn, args) => {
    try {
      setLoading(true);
      return await fn(...args);
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
    const res = await handleRequest(chatAI, [prompt]);
    return res?.reply || "";
  };

  const handleSummarize = async (content) => {
    const res = await handleRequest(summarizeAI, [content]);
    return res?.summary || "";
  };

  const handleTags = async (title, content) => {
    const res = await handleRequest(generateTagsAI, [title, content]);

    try {
      return JSON.parse(res?.tags || "[]");
    } catch {
      return [];
    }
  };

  const handleExplain = async (topic) => {
    const res = await handleRequest(explainAI, [topic]);
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