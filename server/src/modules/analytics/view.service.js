import Blog from "../blog/blog.model.js";

export const incrementView = async (blogId) => {
  await Blog.findByIdAndUpdate(blogId, { $inc: { views: 1 } }, { new: true });
};
