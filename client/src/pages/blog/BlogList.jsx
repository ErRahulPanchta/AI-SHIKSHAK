import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { motion } from "framer-motion";

import { getBlogs } from "../../services/blog.service";

import BlogCard from "../../components/blog/BlogCard";
import Pagination from "../../components/common/Pagination";
import CategoryFilter from "../../components/blog/CategoryFilter";
import SearchBar from "../../components/blog/SearchBar";

import useDebounce from "../../hooks/useDebounce";

const BlogList = () => {
  const [blogs, setBlogs] = useState([]);

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [category, setCategory] = useState("");
  const [search, setSearch] = useState("");

  const [loading, setLoading] = useState(true);

  // 🔥 Debounced search
  const debouncedSearch = useDebounce(search, 500);

  const fetchBlogs = async () => {
    try {
      setLoading(true);

      const res = await getBlogs({
        page,
        limit: 6,
        category,
        q: debouncedSearch,
      });

      setBlogs(res.data.data.blogs || []);
      setTotalPages(res.data.data.totalPages || 1);
    } catch (error) {
      console.error(error);
      toast.error("Failed to fetch blogs");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, [page, category, debouncedSearch]);

  return (
    <div className="p-6 max-w-6xl mx-auto">

      {/* 🔥 Title */}
      <h2 className="text-3xl font-bold text-center mb-6">
        Explore Blogs
      </h2>

      {/* 🔍 Search */}
      <SearchBar
        value={search}
        onChange={(val) => {
          setSearch(val);
          setPage(1); // reset page
        }}
      />

      {/* 🏷 Category */}
      <CategoryFilter
        selected={category}
        onChange={(cat) => {
          setCategory(cat);
          setPage(1);
        }}
      />

      {/* ⏳ Loading */}
      {loading ? (
        <div className="flex justify-center mt-10">
          <p className="text-gray-500 animate-pulse">
            Loading blogs...
          </p>
        </div>
      ) : blogs.length === 0 ? (
        <div className="text-center mt-10 text-gray-500">
          <p className="text-lg font-medium">
            No blogs found
          </p>
          <p className="text-sm">
            Try different search or category
          </p>
        </div>
      ) : (
        <>
          {/* 🧠 Grid */}
          <motion.div
            className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            {blogs.map((blog) => (
              <motion.div
                key={blog._id}
                whileHover={{ scale: 1.04 }}
              >
                <BlogCard blog={blog} />
              </motion.div>
            ))}
          </motion.div>

          {/* 📄 Pagination */}
          <Pagination
            page={page}
            totalPages={totalPages}
            onPageChange={setPage}
          />
        </>
      )}
    </div>
  );
};

export default BlogList;