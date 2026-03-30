import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";

import {
  getMyBlogs,
  submitBlog,
  deleteBlog,
} from "../../services/blog.service";

import useAuthStore from "../../store/authStore";

import {
  FaEdit,
  FaTrash,
  FaPaperPlane,
  FaEye,
  FaHeart,
} from "react-icons/fa";

const MyBlogs = () => {
  const { user } = useAuthStore();

  const [blogs, setBlogs] = useState([]);
  const [loadingId, setLoadingId] = useState(null);

  // 🔥 Fetch Blogs
  const fetchBlogs = async () => {
    try {
      const res = await getMyBlogs(user._id);
      setBlogs(res.data.data.blogs || []);
    } catch {
      toast.error("Failed to fetch blogs");
    }
  };

  useEffect(() => {
    if (user?._id) fetchBlogs();
  }, [user]);

  // 🚀 Submit Blog
  const handleSubmit = async (id) => {
    try {
      setLoadingId(id);

      await submitBlog(id);

      toast.success("Submitted for review");

      setBlogs((prev) =>
        prev.map((b) =>
          b._id === id ? { ...b, status: "pending" } : b
        )
      );
    } catch {
      toast.error("Submit failed");
    } finally {
      setLoadingId(null);
    }
  };

  // ❌ Delete Blog
  const handleDelete = async (id) => {
    const confirm = window.confirm("Delete this blog?");

    if (!confirm) return;

    try {
      setLoadingId(id);

      await deleteBlog(id);

      toast.success("Blog deleted");

      // ✅ Optimistic update
      setBlogs((prev) => prev.filter((b) => b._id !== id));
    } catch {
      toast.error("Delete failed");
    } finally {
      setLoadingId(null);
    }
  };

  // 🎯 Status Badge
  const getStatusBadge = (status) => {
    const styles = {
      draft: "bg-gray-200 text-gray-700",
      pending: "bg-yellow-200 text-yellow-800",
      approved: "bg-green-200 text-green-700",
      rejected: "bg-red-200 text-red-700",
    };

    return (
      <span
        className={`px-2 py-1 text-xs rounded-full font-medium ${styles[status]}`}
      >
        {status}
      </span>
    );
  };

  return (
    <div className="p-6 max-w-5xl mx-auto">

      {/* 🔥 Title */}
      <h2 className="text-3xl font-bold mb-8 text-center">
        My Blogs
      </h2>

      {blogs.length === 0 ? (
        <div className="text-center text-gray-500">
          <p className="text-lg">No blogs yet</p>
          <p className="text-sm">
            Start writing your first blog 🚀
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {blogs.map((blog) => (
            <div
              key={blog._id}
              className="bg-white p-5 rounded-xl shadow hover:shadow-md transition flex flex-col md:flex-row md:justify-between md:items-center gap-4"
            >
              {/* LEFT */}
              <div className="space-y-1">
                <h3 className="font-semibold text-lg">
                  {blog.title}
                </h3>

                <div className="flex items-center gap-3 text-sm text-gray-500">
                  {getStatusBadge(blog.status)}

                  <span>
                    {new Date(blog.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>

              {/* RIGHT ACTIONS */}
              <div className="flex flex-wrap gap-3 items-center">

                {/* 📝 DRAFT */}
                {blog.status === "draft" && (
                  <>
                    <Link
                      to={`/edit-blog/${blog._id}`}
                      className="flex items-center gap-1 px-3 py-1 bg-blue-500 text-white rounded text-sm"
                    >
                      <FaEdit /> Edit
                    </Link>

                    <button
                      onClick={() => handleSubmit(blog._id)}
                      disabled={loadingId === blog._id}
                      className="flex items-center gap-1 px-3 py-1 bg-green-600 text-white rounded text-sm"
                    >
                      <FaPaperPlane />
                      {loadingId === blog._id
                        ? "Submitting..."
                        : "Submit"}
                    </button>
                  </>
                )}

                {/* ⏳ PENDING */}
                {blog.status === "pending" && (
                  <span className="text-yellow-600 text-sm">
                    Awaiting approval
                  </span>
                )}

                {/* ✅ APPROVED */}
                {blog.status === "approved" && (
                  <div className="flex gap-4 text-sm text-gray-600">
                    <span className="flex items-center gap-1">
                      <FaEye /> {blog.views || 0}
                    </span>
                    <span className="flex items-center gap-1">
                      <FaHeart /> {blog.likes || 0}
                    </span>
                  </div>
                )}

                {/* ❌ REJECTED */}
                {blog.status === "rejected" && (
                  <>
                    <Link
                      to={`/edit-blog/${blog._id}`}
                      className="flex items-center gap-1 px-3 py-1 bg-blue-500 text-white rounded text-sm"
                    >
                      <FaEdit /> Fix
                    </Link>

                    <span className="text-red-500 text-xs">
                      {blog.rejectionReason || "Rejected"}
                    </span>
                  </>
                )}

                {/* 🗑 DELETE (for all except approved optional) */}
                {blog.status !== "approved" && (
                  <button
                    onClick={() => handleDelete(blog._id)}
                    disabled={loadingId === blog._id}
                    className="flex items-center gap-1 px-3 py-1 bg-red-500 text-white rounded text-sm"
                  >
                    <FaTrash />
                    {loadingId === blog._id
                      ? "Deleting..."
                      : "Delete"}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyBlogs;