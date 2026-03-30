import { useEffect, useState } from "react";
import { getBlogs } from "../../services/blog.service";
import BlogCard from "../blog/BlogCard";
import toast from "react-hot-toast";

const FeaturedBlogs = () => {
  const [blogs, setBlogs] = useState([]);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const res = await getBlogs();

        setBlogs(res.data.data.blogs.slice(0, 6));
      } catch (error) {
        toast.error("Failed to load blogs");
      }
    };

    fetchBlogs();
  }, []);

  return (
    <section className="p-6">

      <h2 className="text-2xl font-bold text-center mb-6">
        Featured Blogs
      </h2>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">

        {blogs.map((blog) => (
          <BlogCard key={blog._id} blog={blog} />
        ))}

      </div>

    </section>
  );
};

export default FeaturedBlogs;