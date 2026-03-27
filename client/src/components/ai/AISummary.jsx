import { useState } from "react";
import { useAI } from "../../hooks/useAI";

const AISummary = ({ content }) => {
const { handleSummarize, loading } = useAI();
  const [summary, setSummary] = useState("");

  const generateSummary = async () => {
    const res = await handleSummarize(content);

    if (res) {
      setSummary(res);
    }
  };

  return (
    <div className="mt-6 p-4 border rounded-xl bg-gray-50">
      <button
        onClick={generateSummary}
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        {loading ? "Generating..." : "✨ Generate AI Summary"}
      </button>

      {summary && (
        <p className="mt-4 text-gray-700">{summary}</p>
      )}
    </div>
  );
};

export default AISummary;