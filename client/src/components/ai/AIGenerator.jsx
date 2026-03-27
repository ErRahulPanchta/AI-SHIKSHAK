import { useState } from "react";
import { useAI } from "../../hooks/useAI";
import toast from "react-hot-toast";

const AIGenerator = ({ onInsert }) => {
  const { handleGenerate, loading } = useAI();
  const [prompt, setPrompt] = useState("");

  const generate = async () => {
    if (loading) return;

    const text = await handleGenerate(prompt);

    if (!text || text.includes("⚠️")) {
      toast.error(text || "Failed to generate content");
      return;
    }

    onInsert(text);
  };

  return (
    <div className="p-4 border rounded-xl bg-white">
      <textarea
        placeholder="Enter topic"
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        className="w-full border p-2 rounded"
      />

      <button
        onClick={generate}
        disabled={loading}
        className={`mt-2 px-4 py-2 rounded text-white ${
          loading ? "bg-gray-400" : "bg-green-600"
        }`}
      >
        {loading ? "Generating..." : "✨ Generate Content"}
      </button>
    </div>
  );
};

export default AIGenerator;