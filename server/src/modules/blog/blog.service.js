import Blog from "./blog.model.js";
import ApiError from "../../utils/ApiError.js";
import httpStatus from "../../constant/httpStatus.js";
import pagination from "../../utils/pagination.js";
import logger from "../../utils/logger.js";
import { incrementView } from "../analytics/view.service.js";
import { getCache, setCache } from "../cache/cache.service.js";
import { CACHE_KEYS } from "../cache/cache.keys.js";

export const createBlog = async (userId, userRole, data) => {
  const blog = await Blog.create({
    ...data,
    author: userId,
    status: userRole === "admin" ? "approved" : "draft",
  });

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

  await incrementView(blog._id);

  return blog;
};

export const getBlogs = async (query) => {
  const { page, limit, skip } = pagination(query);

  const filter = {
    isDeleted: false,
  };

  if (query.status) {
    filter.status = query.status;
  } else {
    filter.status = "approved";
  }

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
export const getBlogById = async (blogId, userId) => {
  const blog = await Blog.findById(blogId);

  if (!blog || blog.isDeleted) {
    throw new ApiError(404, "Blog not found");
  }

  if (blog.author.toString() !== userId.toString()) {
    throw new ApiError(403, "Not authorized");
  }

  return blog;
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

export const searchBlogs = async (query) => {
  const { q } = query;

  if (!q) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Search query is required");
  }

  const { page, limit, skip } = pagination(query);

  const filter = {
    $text: { $search: q },
    status: "approved",
    isDeleted: false,
  };

  const blogs = await Blog.find(filter, { score: { $meta: "textScore" } })
    .populate("author", "name avatar")
    .populate("category", "name")
    .sort({ score: { $meta: "textScore" } })
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

export const getTrendingBlogs = async (query) => {
  let { page = 1, limit = 10 } = query;

  page = parseInt(page);
  limit = parseInt(limit);

  const blogs = await Blog.aggregate([
    { $match: { status: "approved", isDeleted: false } },

    {
      $addFields: {
        trendingScore: {
          $add: ["$views", { $multiply: ["$likes", 3] }],
        },
      },
    },

    { $sort: { trendingScore: -1 } },
    { $skip: (page - 1) * limit },
    { $limit: limit }, // ✅ now correct
  ]);

  return { page, limit, blogs };
};

export const getRecommendedBlogs = async (slug) => {
  const blog = await Blog.findOne({
    slug,
    status: "approved",
    isDeleted: false,
  });

  if (!blog) {
    throw new ApiError(httpStatus.NOT_FOUND, "Blog not found");
  }

  const recommendations = await Blog.aggregate([
    {
      $match: {
        _id: { $ne: blog._id },
        status: "approved",
        isDeleted: false,
        $or: [
          { tags: { $in: blog.tags } },
          { category: blog.category },
        ],
      },
    },
    {
      $addFields: {
        score: {
          $add: ["$views", { $multiply: ["$likes", 3] }],
        },
      },
    },
    { $sort: { score: -1 } },
    { $limit: 5 },
    {
      $project: {
        _id: 1,
        title: 1,
        slug: 1,
        coverImage: 1,
        views: 1,
        likes: 1,
        author: 1,
        category: 1,
      },
    },
  ]);

  await Blog.populate(recommendations, {
    path: "author",
    select: "name avatar",
  });

  await Blog.populate(recommendations, {
    path: "category",
    select: "name",
  });

  return {
    data: recommendations,
  };
};
