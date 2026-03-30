import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { motion } from "framer-motion";

import {
  getBlogBySlug,
  likeBlog,
  getRelatedBlogs,
} from "../../services/blog.service";

import AISummary from "../../components/ai/AISummary";
import BlogCard from "../../components/blog/BlogCard";

import { FaHeart, FaUser, FaTag, FaCalendarAlt } from "react-icons/fa";
import RecommendedBlogs from "../../components/home/RecommendedBlogs";

const BlogDetails = () => {
  const { slug } = useParams();

  const [blog, setBlog] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);
  const [likeLoading, setLikeLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const res = await getBlogBySlug(slug);
        const blogData = res.data.data;
        setBlog(blogData);

        // Related blogs
        const rel = await getRelatedBlogs(slug);
        setRelated(rel.data.data || []);
      } catch (error) {
        console.error(error);
        toast.error("Failed to load blog");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [slug]);

  const handleLike = async () => {
    if (likeLoading) return;

    try {
      setLikeLoading(true);

      const res = await likeBlog(blog._id);

      setBlog((prev) => ({
        ...prev,
        likes: res.data.data.likes,
      }));
    } catch {
      toast.error("Failed to like blog");
    } finally {
      setLikeLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center mt-24">
        <p className="text-gray-500 text-lg animate-pulse">Loading blog...</p>
      </div>
    );
  }

  if (!blog) {
    return <p className="text-center mt-10 text-gray-500">Blog not found</p>;
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      {/* ================= BLOG ================= */}
      <motion.div
        initial={{ opacity: 0, y: 25 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="space-y-6"
      >
        <h1 className="text-3xl md:text-4xl font-bold leading-tight">
          {blog.title}
        </h1>

        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
          <div className="flex items-center gap-1">
            <FaUser /> {blog.author?.name}
          </div>

          <div className="flex items-center gap-1">
            <FaTag /> {blog.category?.name || "General"}
          </div>

          <div className="flex items-center gap-1">
            <FaCalendarAlt />
            {new Date(blog.createdAt).toLocaleDateString()}
          </div>

          <button
            onClick={handleLike}
            disabled={likeLoading}
            className={`flex items-center gap-2 px-3 py-1 rounded-full transition 
              ${likeLoading ? "bg-gray-200" : "bg-red-100 hover:bg-red-200"}`}
          >
            <FaHeart className="text-red-500" />
            {blog.likes || 0}
          </button>
        </div>

        {blog.coverImage && (
          <img
            src={blog.coverImage}
            alt={blog.title}
            className="w-full h-72 object-cover rounded-xl shadow"
          />
        )}

        <div className="space-y-5 text-gray-700 leading-relaxed">
          {blog.content.map((block, index) => {
            switch (block.type) {
              case "heading":
                return (
                  <h2 key={index} className="text-2xl font-semibold mt-6">
                    {block.text}
                  </h2>
                );

              case "paragraph":
                return (
                  <p key={index} className="text-base">
                    {block.text}
                  </p>
                );

              case "image":
                return (
                  <img
                    key={index}
                    src={block.url}
                    alt={block.caption}
                    className="rounded-lg shadow"
                  />
                );

              case "quote":
                return (
                  <blockquote
                    key={index}
                    className="border-l-4 pl-4 italic text-gray-600"
                  >
                    {block.text}
                  </blockquote>
                );

              case "list":
                return (
                  <ul key={index} className="list-disc pl-6 space-y-1">
                    {block.items?.map((item, i) => (
                      <li key={i}>{item}</li>
                    ))}
                  </ul>
                );

              case "code":
                return (
                  <pre
                    key={index}
                    className="bg-gray-900 text-white p-4 rounded-lg overflow-x-auto text-sm"
                  >
                    <code>{block.text}</code>
                  </pre>
                );

              default:
                return null;
            }
          })}
        </div>

        <div className="bg-gray-50 p-5 rounded-xl shadow-sm">
          <AISummary content={blog.content} />
        </div>
      </motion.div>
      {/* ================= RELATED BLOGS ================= */}
      {related.length > 0 && (
        <motion.div
          className="mt-14"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <h3 className="text-2xl font-bold mb-6">Related Blogs</h3>

          <div className="grid md:grid-cols-2 gap-6">
            {related.map((b) => (
              <motion.div
                key={b._id}
                whileHover={{ scale: 1.03 }}
                transition={{ duration: 0.2 }}
              >
                <BlogCard blog={b} />
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}
      {slug && <RecommendedBlogs slug={slug} />}{" "}
    </div>
  );
};

export default BlogDetails;
