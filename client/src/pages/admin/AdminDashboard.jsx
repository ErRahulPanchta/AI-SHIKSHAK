import { useEffect, useState } from "react";
import toast from "react-hot-toast";

import {
  getPendingBlogs,
  approveBlog,
  rejectBlog,
} from "../../services/admin.service";

import AdminBlogCard from "../../components/admin/AdminBlogCard";
import RejectModal from "../../components/admin/RejectModel";

const AdminDashboard = () => {
  const [blogs, setBlogs] = useState([]);
  const [selectedBlog, setSelectedBlog] = useState(null);

  const fetchBlogs = async () => {
    try {
      const res = await getPendingBlogs();
      setBlogs(res.data.data.blogs);
    } catch (err) {
      toast.error("Failed to fetch blogs");
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  const handleApprove = async (id) => {
    try {
      await approveBlog(id);
      toast.success("Blog approved");
      fetchBlogs();
    } catch {
      toast.error("Approve failed");
    }
  };

  // ❌ REJECT
  const handleReject = async (id, reason) => {
    try {
      await rejectBlog(id, reason);
      toast.success("Blog rejected");
      setSelectedBlog(null);
      fetchBlogs();
    } catch {
      toast.error("Reject failed");
    }
  };

  return (
    <div className="p-6 max-w-5xl mx-auto">

      <h2 className="text-2xl font-bold mb-6">
        Admin Dashboard
      </h2>

      {blogs.length === 0 ? (
        <p className="text-gray-500">No pending blogs</p>
      ) : (
        <div className="grid md:grid-cols-2 gap-4">
          {blogs.map((blog) => (
            <AdminBlogCard
              key={blog._id}
              blog={blog}
              onApprove={handleApprove}
              onReject={setSelectedBlog}
            />
          ))}
        </div>
      )}

      {selectedBlog && (
        <RejectModal
          blog={selectedBlog}
          onClose={() => setSelectedBlog(null)}
          onConfirm={handleReject}
        />
      )}

    </div>
  );
};

export default AdminDashboard;