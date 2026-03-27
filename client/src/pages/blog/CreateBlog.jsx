import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

import Editor from "../../components/blog/Editor";
import AIGenerator from "../../components/ai/AIGenerator";
import { useAI } from "../../hooks/useAI";

import { createBlog, submitBlog } from "../../services/blog.service";
import { getCategories } from "../../services/category.service";

const CreateBlog = () => {
  const navigate = useNavigate();
  const { handleTags, loading: aiLoading } = useAI();

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);

  const [data, setData] = useState({
    title: "",
    category: "",
    tags: "",
    content: [],
  });

  useEffect(() => {
    getCategories()
      .then((res) => setCategories(res.data.data))
      .catch(() => toast.error("Failed to load categories"));
  }, []);

  const transformContent = (blocks) => {
    return blocks.map((block) => {
      switch (block.type) {
        case "paragraph":
          return {
            type: "paragraph",
            text: block.data.text || "",
          };

        case "header":
          return {
            type: "heading",
            text: block.data.text || "",
            level: block.data.level || 1,
          };

        case "list":
          return {
            type: "list",
            items: block.data.items || [],
          };

        case "code":
          return {
            type: "code",
            text: block.data.code || "",
          };

        default:
          return {
            type: "paragraph",
            text: block.data.text || "",
          };
      }
    });
  };

  const buildPayload = () => ({
    title: data.title,
    category: data.category,
    tags: data.tags ? data.tags.split(",").map((t) => t.trim()) : [],
    content: transformContent(data.content),
  });

  const handleSaveDraft = async () => {
    if (loading) return;

    try {
      setLoading(true);
      await createBlog(buildPayload());
      toast.success("Draft saved");
      navigate("/my-blogs");
    } catch {
      toast.error("Failed");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (loading) return;

    try {
      setLoading(true);
      const res = await createBlog(buildPayload());
      await submitBlog(res.data.data._id);
      toast.success("Submitted");
      navigate("/my-blogs");
    } catch {
      toast.error("Failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-4">
      <h2 className="text-2xl font-bold">Create Blog</h2>

      {/* AI Generator */}
      <AIGenerator
        onInsert={(content) =>
          setData((prev) => ({
            ...prev,
            content: [{ type: "paragraph", text: content }],
          }))
        }
      />

      {/* Title */}
      <input
        placeholder="Title"
        className="w-full border p-3 rounded"
        value={data.title}
        onChange={(e) => setData({ ...data, title: e.target.value })}
      />

      {/* Category */}
      <select
        className="w-full border p-3 rounded"
        value={data.category}
        onChange={(e) => setData({ ...data, category: e.target.value })}
      >
        <option value="">Select</option>
        {categories.map((c) => (
          <option key={c._id} value={c._id}>
            {c.name}
          </option>
        ))}
      </select>

      {/* Tags + AI */}
      <div className="flex gap-2">
        <input
          placeholder="tags"
          className="w-full border p-3 rounded"
          value={data.tags}
          onChange={(e) => setData({ ...data, tags: e.target.value })}
        />

        <button
          disabled={aiLoading}
          onClick={async () => {
            if (aiLoading) return;

            const result = await handleTags(
              data.title,
              data.content.map((c) => c.text).join(" "),
            );

            if (typeof result === "string" && result.includes("⚠️")) {
              toast.error(result);
              return;
            }

            if (result?.length) {
              setData((prev) => ({
                ...prev,
                tags: result.join(", "),
              }));
            } else {
              toast.error("Failed to generate tags");
            }
          }}
          className={`px-3 rounded text-white ${
            aiLoading ? "bg-gray-400 cursor-not-allowed" : "bg-purple-600"
          }`}
        >
          {aiLoading ? "..." : "✨"}
        </button>
      </div>

      {/* Editor */}
      <Editor
        value={data.content}
        onChange={(val) => setData((prev) => ({ ...prev, content: val }))}
      />

      {/* Actions */}
      <div className="flex gap-3">
        <button
          onClick={handleSaveDraft}
          disabled={loading}
          className={`px-4 py-2 rounded text-white ${
            loading ? "bg-gray-400 cursor-not-allowed" : "bg-gray-500"
          }`}
        >
          {loading ? "Saving..." : "Save Draft"}
        </button>

        <button
          onClick={handleSubmit}
          disabled={loading}
          className={`px-4 py-2 rounded text-white ${
            loading ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600"
          }`}
        >
          {loading ? "Submitting..." : "Submit"}
        </button>
      </div>
    </div>
  );
};

export default CreateBlog;
