import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { motion } from "framer-motion";

import { getRecommendedBlogs } from "../../services/blog.service";
import BlogCard from "../blog/BlogCard";

import { FaBolt } from "react-icons/fa";

const RecommendedBlogs = ({ slug }) => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchRecommended = async () => {
    try {
      setLoading(true);

      const res = await getRecommendedBlogs(slug);
      console.log("Slug:", slug);

      console.log("Recommended:", res);

      const data = res.data?.data?.data || [];

      setBlogs(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load recommendations");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (slug) fetchRecommended();
  }, [slug]);

  if (loading) {
    return (
      <div className="text-center text-gray-500 mt-10">
        Loading recommendations...
      </div>
    );
  }

  if (blogs.length === 0) return null;

  return (
    <section className="mt-16">
      {/* ⚡ Title */}
      <div className="flex items-center gap-2 mb-6">
        <FaBolt className="text-yellow-500 text-xl" />
        <h3 className="text-2xl font-bold">Recommended for you</h3>
      </div>

      {/* Grid */}
      <motion.div
        className="grid md:grid-cols-2 gap-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        {blogs.map((blog) => (
          <motion.div key={blog._id} whileHover={{ scale: 1.03 }}>
            <BlogCard blog={blog} />
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
};

export default RecommendedBlogs;
