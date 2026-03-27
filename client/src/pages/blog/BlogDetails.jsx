import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { getBlogBySlug } from "../../services/blog.service";
import AISummary from "../../components/ai/AISummary";

const BlogDetails = () => {
  const { slug } = useParams();

  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const res = await getBlogBySlug(slug);
        setBlog(res.data.data);
      } catch (error) {
        console.error(error);
        toast.error("Failed to load blog");
      } finally {
        setLoading(false);
      }
    };

    fetchBlog();
  }, [slug]);

  if (loading) {
    return <p className="text-center mt-10">Loading...</p>;
  }

  if (!blog) {
    return <p className="text-center mt-10">Blog not found</p>;
  }

  return (
    <div className="max-w-3xl mx-auto p-6">
      {/* Title */}
      <h1 className="text-3xl font-bold mb-4">{blog.title}</h1>

      {/* Meta */}
      <div className="flex gap-4 text-sm text-gray-500 mb-6">
        <span>By {blog.author?.name}</span>
        <span>•</span>
        <span>{blog.category?.name || "General"}</span>
      </div>

      {/* Cover Image */}
      {blog.coverImage && (
        <img
          src={blog.coverImage}
          alt={blog.title}
          className="w-full h-64 object-cover rounded-lg mb-6"
        />
      )}

      <div className="space-y-4">
        {blog.content.map((block, index) => {
          switch (block.type) {
            case "heading":
              return (
                <h2 key={index} className="text-2xl font-semibold">
                  {block.text}
                </h2>
              );

            case "paragraph":
              return (
                <p key={index} className="text-gray-700 leading-relaxed">
                  {block.text}
                </p>
              );

            case "image":
              return (
                <img
                  key={index}
                  src={block.url}
                  alt={block.caption}
                  className="rounded-lg"
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
                <ul key={index} className="list-disc pl-6">
                  {block.items?.map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
              );

            default:
              return null;
          }
        })}
      </div>
      <AISummary content={blog.content} />
    </div>
  );
};

export default BlogDetails;
