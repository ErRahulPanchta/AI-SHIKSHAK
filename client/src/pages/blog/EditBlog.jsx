import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import Editor from "../../components/blog/Editor";
import { getBlogById, updateBlog } from "../../services/blog.service";

const EditBlog = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [data, setData] = useState({
    title: "",
    category: "",
    tags: "",
    content: [],
  });

  useEffect(() => {
    getBlogById(id)
      .then((res) => {
        const blog = res.data.data;
        setData({
          title: blog.title,
          category: blog.category,
          tags: blog.tags?.join(", "),
          content: blog.content || [],
        });
      })
      .catch(() => toast.error("Failed"));
  }, [id]);

  const handleUpdate = async () => {
    try {
      await updateBlog(id, {
        ...data,
        tags: data.tags.split(",").map((t) => t.trim()),
      });
      toast.success("Updated");
      navigate("/my-blogs");
    } catch {
      toast.error("Failed");
    }
  };

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-4">
      <h2 className="text-2xl font-bold">Edit Blog</h2>

      <input
        value={data.title}
        onChange={(e) =>
          setData({ ...data, title: e.target.value })
        }
        className="w-full border p-3 rounded"
      />

      <Editor
        value={data.content}
        onChange={(val) =>
          setData((prev) => ({ ...prev, content: val }))
        }
      />

      <button
        onClick={handleUpdate}
        className="bg-green-600 text-white px-4 py-2 rounded"
      >
        Update
      </button>
    </div>
  );
};

export default EditBlog;