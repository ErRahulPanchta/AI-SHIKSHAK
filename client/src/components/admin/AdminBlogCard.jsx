const AdminBlogCard = ({ blog, onApprove, onReject }) => {
  return (
    <div className="bg-white p-4 rounded-lg shadow space-y-2">

      <h3 className="text-lg font-semibold">{blog.title}</h3>

      <p className="text-sm text-gray-500">
        By {blog.author?.name || "Unknown"}
      </p>

      <div className="flex gap-3 mt-3">

        <button
          onClick={() => onApprove(blog._id)}
          className="bg-green-600 text-white px-3 py-1 rounded"
        >
          Approve
        </button>

        <button
          onClick={() => onReject(blog)}
          className="bg-red-500 text-white px-3 py-1 rounded"
        >
          Reject
        </button>

      </div>

    </div>
  );
};

export default AdminBlogCard;