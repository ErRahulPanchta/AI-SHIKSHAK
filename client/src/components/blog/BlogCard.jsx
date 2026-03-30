import { Link } from "react-router-dom";
import { FaUser, FaHeart } from "react-icons/fa";

const BlogCard = ({ blog, index }) => {
  return (
    <div className="bg-white shadow-md rounded-2xl overflow-hidden hover:shadow-xl transition duration-300 flex flex-col">

      {/* 🖼 IMAGE CONTAINER */}
      <div className="relative h-48 w-full overflow-hidden">

        {blog.coverImage ? (
          <img
            src={blog.coverImage}
            alt={blog.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gray-200" />
        )}

        {/* 🔥 BADGE (LOCKED INSIDE IMAGE ONLY) */}
        {index !== undefined && (
          <div className="absolute top-3 left-3 z-10">
            <span className="bg-gradient-to-r from-orange-500 to-red-500 text-white text-xs font-bold px-2 py-1 rounded-md shadow">
              #{index + 1}
            </span>
          </div>
        )}
      </div>

      {/* 📄 CONTENT */}
      <div className="p-4 flex flex-col flex-grow space-y-3">

        {/* TITLE */}
        <h3 className="text-lg font-semibold leading-snug line-clamp-2">
          {blog.title}
        </h3>

        {/* AUTHOR */}
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <FaUser />
          <span className="truncate">{blog.author?.name}</span>
        </div>

        {/* FOOTER */}
        <div className="flex justify-between items-center text-sm text-gray-500 mt-auto">
          <span className="truncate max-w-[60%]">
            {blog.category?.name}
          </span>

          <div className="flex items-center gap-1">
            <FaHeart className="text-red-400" />
            {blog.likes || 0}
          </div>
        </div>

        {/* CTA */}
        <Link
          to={`/blogs/${blog.slug}`}
          className="text-blue-500 font-medium hover:underline"
        >
          Read More →
        </Link>
      </div>
    </div>
  );
};

export default BlogCard;