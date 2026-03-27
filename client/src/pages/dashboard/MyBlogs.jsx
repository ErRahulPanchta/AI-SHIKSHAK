import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";

import useAuthStore from "../../store/authStore";
import { getMyBlogs, submitBlog } from "../../services/blog.service";

const MyBlogs = () => {
  const { user } = useAuthStore();

  const [blogs, setBlogs] = useState([]);
  const [loadingId, setLoadingId] = useState(null);

  const fetchBlogs = async () => {
    try {
      const res = await getMyBlogs(user._id);
      setBlogs(res.data.data.blogs);
    } catch (error) {
      toast.error("Failed to fetch blogs");
    }
  };

  useEffect(() => {
    if (user?._id) {
      fetchBlogs();
    }
  }, [user]);

  const handleSubmit = async (id) => {
    try {
      setLoadingId(id);
      await submitBlog(id);
      toast.success("Submitted for review");
      fetchBlogs();
    } catch (error) {
      toast.error("Submit failed");
    } finally {
      setLoadingId(null);
    }
  };

  const getStatusBadge = (status) => {
    const styles = {
      draft: "bg-gray-200 text-gray-700",
      pending: "bg-yellow-200 text-yellow-800",
      approved: "bg-green-200 text-green-700",
      rejected: "bg-red-200 text-red-700",
    };

    return (
      <span className={`px-2 py-1 text-xs rounded ${styles[status]}`}>
        {status}
      </span>
    );
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">My Blogs</h2>

      {blogs.length === 0 ? (
        <p className="text-gray-500">No blogs yet</p>
      ) : (
        <div className="space-y-4">
          {blogs.map((blog) => (
            <div
              key={blog._id}
              className="bg-white p-4 rounded-lg shadow flex justify-between items-center"
            >
              {/* LEFT */}
              <div>
                <h3 className="font-semibold text-lg">{blog.title}</h3>

                <div className="flex gap-2 mt-1 items-center">
                  {getStatusBadge(blog.status)}

                  <span className="text-sm text-gray-500">
                    {new Date(blog.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>

              {/* RIGHT ACTIONS */}
              <div className="flex gap-3 items-center">
                {/* DRAFT */}
                {blog.status === "draft" && (
                  <>
                    <Link
                      to={`/edit-blog/${blog._id}`}
                      className="px-3 py-1 bg-blue-500 text-white rounded text-sm"
                    >
                      Edit
                    </Link>

                    <button
                      onClick={() => handleSubmit(blog._id)}
                      disabled={loadingId === blog._id}
                      className="px-3 py-1 bg-green-600 text-white rounded text-sm"
                    >
                      {loadingId === blog._id ? "Submitting..." : "Submit"}
                    </button>
                  </>
                )}

                {/* PENDING */}
                {blog.status === "pending" && (
                  <span className="text-yellow-600 text-sm">
                    Awaiting approval
                  </span>
                )}

                {/* APPROVED */}
                {blog.status === "approved" && (
                  <div className="flex gap-3 text-sm text-gray-600">
                    <span>👁 {blog.views || 0}</span>
                    <span>❤️ {blog.likes || 0}</span>
                  </div>
                )}

                {/* REJECTED */}
                {blog.status === "rejected" && (
                  <>
                    <Link
                      to={`/edit-blog/${blog._id}`}
                      className="px-3 py-1 bg-blue-500 text-white rounded text-sm"
                    >
                      Fix
                    </Link>

                    <span className="text-red-500 text-xs">
                      {blog.rejectionReason || "Rejected"}
                    </span>
                  </>
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
