import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { motion } from "framer-motion";

import { getTrendingBlogs } from "../../services/blog.service";
import BlogCard from "../blog/BlogCard";

import { FaFire } from "react-icons/fa";

const TrendingBlogs = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchTrending = async () => {
    try {
      setLoading(true);

      const res = await getTrendingBlogs({ limit: 6 });

      // ✅ FIX: correct nested response
      const data = res.data?.data?.blogs || res.data?.data?.data || [];

      setBlogs(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load trending blogs");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTrending();
  }, []);

  return (
    <section className="px-6 py-12 max-w-6xl mx-auto">

      {/* 🔥 Title */}
      <div className="flex items-center justify-center gap-2 mb-10">
        <FaFire className="text-orange-500 text-2xl" />
        <h2 className="text-3xl font-bold text-center">
          Trending Blogs
        </h2>
      </div>

      {/* ⏳ Loading Skeleton */}
      {loading ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="bg-white rounded-2xl shadow animate-pulse overflow-hidden"
            >
              <div className="h-48 bg-gray-200"></div>
              <div className="p-4 space-y-3">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/3"></div>
              </div>
            </div>
          ))}
        </div>
      ) : blogs.length === 0 ? (
        <div className="text-center text-gray-500">
          No trending blogs yet
        </div>
      ) : (
        <motion.div
          className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          {blogs.map((blog, index) => (
            <motion.div
              key={blog._id}
              whileHover={{ scale: 1.04 }}
              transition={{ duration: 0.2 }}
            >
              {/* ✅ Pass index instead of manual badge */}
              <BlogCard blog={blog} index={index} />
            </motion.div>
          ))}
        </motion.div>
      )}
    </section>
  );
};

export default TrendingBlogs;