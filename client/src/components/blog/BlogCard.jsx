import { Link } from "react-router-dom";

const BlogCard = ({ blog }) => {
  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition">

      {/* Image */}
      {blog.coverImage && (
        <img
          src={blog.coverImage}
          alt={blog.title}
          className="w-full h-48 object-cover"
        />
      )}

      <div className="p-4 space-y-2">

        {/* Category */}
        <span className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded">
          {blog.category?.name || "General"}
        </span>

        {/* Title */}
        <h3 className="text-lg font-semibold line-clamp-2">
          {blog.title}
        </h3>

        {/* Author */}
        <p className="text-sm text-gray-500">
          By {blog.author?.name || "Unknown"}
        </p>

        {/* Button */}
        <Link
          to={`/blogs/${blog.slug}`}
          className="inline-block mt-2 text-blue-500 hover:underline"
        >
          Read More →
        </Link>

      </div>
    </div>
  );
};

export default BlogCard;