import Blog from "./blog.model.js";
import ApiError from "../../utils/ApiError.js";
import httpStatus from "../../constant/httpStatus.js";
import pagination from "../../utils/pagination.js";
import logger from "../../utils/logger.js";

export const createBlog = async (userId, data) => {
  const blog = await Blog.create({
    ...data,
    author: userId,
  });

  logger.info(`Blog created by user ${userId}`);

  return blog;
};

export const updateBlog = async (blogId, userId, data) => {
  const blog = await Blog.findById(blogId);

  if (!blog || blog.isDeleted) {
    throw new ApiError(httpStatus.NOT_FOUND, "Blog not found");
  }

  if (blog.author.toString() !== userId.toString()) {
    throw new ApiError(httpStatus.FORBIDDEN, "Not authorized");
  }

  if (blog.status === "approved") {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      "Approved blogs cannot be edited",
    );
  }

  Object.assign(blog, data);

  await blog.save();

  logger.info(`Blog ${blogId} updated`);

  return blog;
};

export const submitBlog = async (blogId, userId) => {
  const blog = await Blog.findById(blogId);

  if (!blog) {
    throw new ApiError(httpStatus.NOT_FOUND, "Blog not found");
  }

  if (blog.author.toString() !== userId.toString()) {
    throw new ApiError(httpStatus.FORBIDDEN, "Not authorized");
  }

  blog.status = "pending";

  await blog.save();

  logger.info(`Blog ${blogId} submitted for review`);

  return blog;
};

export const approveBlog = async (blogId, adminId) => {
  const blog = await Blog.findById(blogId);

  if (!blog) {
    throw new ApiError(httpStatus.NOT_FOUND, "Blog not found");
  }

  blog.status = "approved";
  blog.approvedBy = adminId;
  blog.approvedAt = new Date();

  await blog.save();

  logger.info(`Blog ${blogId} approved by admin ${adminId}`);

  return blog;
};

export const rejectBlog = async (blogId, reason) => {
  const blog = await Blog.findById(blogId);

  if (!blog) {
    throw new ApiError(httpStatus.NOT_FOUND, "Blog not found");
  }

  blog.status = "rejected";
  blog.rejectionReason = reason;

  await blog.save();

  logger.warn(`Blog ${blogId} rejected`);

  return blog;
};

export const getBlogBySlug = async (slug) => {
  const blog = await Blog.findOne({
    slug,
    status: "approved",
    isDeleted: false,
  })
    .populate("author", "name avatar")
    .populate("category", "name");

  if (!blog) {
    throw new ApiError(httpStatus.NOT_FOUND, "Blog not found");
  }

  blog.views += 1;

  await blog.save();

  return blog;
};

export const getBlogs = async (query) => {
  const { page, limit, skip } = pagination(query);

  const filter = {
    status: "approved",
    isDeleted: false,
  };

  if (query.tag) {
    filter.tags = query.tag;
  }

  if (query.category) {
    filter.category = query.category;
  }

  const blogs = await Blog.find(filter)
    .populate("author", "name avatar")
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  const total = await Blog.countDocuments(filter);

  return {
    page,
    total,
    totalPages: Math.ceil(total / limit),
    blogs,
  };
};

export const getBlogsByAuthor = async (authorId, query) => {
  const { page, limit, skip } = pagination(query);

  const blogs = await Blog.find({
    author: authorId,
    isDeleted: false,
  })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  const total = await Blog.countDocuments({
    author: authorId,
    isDeleted: false,
  });

  return {
    page,
    total,
    totalPages: Math.ceil(total / limit),
    blogs,
  };
};

export const getRelatedBlogs = async (slug) => {
  const blog = await Blog.findOne({ slug });

  if (!blog) {
    throw new ApiError(httpStatus.NOT_FOUND, "Blog not found");
  }

  const related = await Blog.find({
    tags: { $in: blog.tags },
    _id: { $ne: blog._id },
    status: "approved",
  })
    .limit(5)
    .select("title slug coverImage");

  return related;
};

export const deleteBlog = async (blogId, userId) => {
  const blog = await Blog.findById(blogId);

  if (!blog) {
    throw new ApiError(httpStatus.NOT_FOUND, "Blog not found");
  }

  if (blog.author.toString() !== userId.toString()) {
    throw new ApiError(httpStatus.FORBIDDEN, "Not authorized");
  }

  blog.isDeleted = true;
  blog.deletedAt = new Date();

  await blog.save();

  logger.warn(`Blog ${blogId} soft deleted`);

  return { message: "Blog deleted successfully" };
};

export const likeBlog = async (blogId) => {
  const blog = await Blog.findById(blogId);

  if (!blog) {
    throw new ApiError(httpStatus.NOT_FOUND, "Blog not found");
  }

  blog.likes += 1;

  await blog.save();

  return { likes: blog.likes };
};
