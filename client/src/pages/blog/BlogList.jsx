import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { getBlogs } from "../../services/blog.service";
import BlogCard from "../../components/blog/BlogCard";

const BlogList = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const res = await getBlogs();

        setBlogs(res.data.data.blogs || []);
      } catch (error) {
        console.error(error);
        toast.error("Failed to fetch blogs");
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center mt-10">
        <p>Loading blogs...</p>
      </div>
    );
  }

  return (
    <div className="p-6">

      <h2 className="text-2xl font-bold mb-6 text-center">
        Latest Blogs
      </h2>

      {blogs.length === 0 ? (
        <p className="text-center text-gray-500">
          No blogs available
        </p>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">

          {blogs.map((blog) => (
            <BlogCard key={blog._id} blog={blog} />
          ))}

        </div>
      )}

    </div>
  );
};

export default BlogList;