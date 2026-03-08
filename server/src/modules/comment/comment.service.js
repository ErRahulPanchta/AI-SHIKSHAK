import mongoose from "mongoose";
import Comment from "./comment.model.js";
import Blog from "../blog/blog.model.js";

import ApiError from "../../utils/ApiError.js";
import httpStatus from "../../constant/httpStatus.js";
import logger from "../../utils/logger.js";

export const createComment = async (blogId, userId, content) => {
  const blog = await Blog.findById(blogId);

  if (!blog) {
    throw new ApiError(httpStatus.NOT_FOUND, "Blog not found");
  }

  const comment = await Comment.create({
    blog: blogId,
    author: userId,
    content,
  });

  logger.info(`Comment created on blog ${blogId}`);

  return comment;
};

export const replyComment = async (commentId, userId, content) => {
  const parent = await Comment.findById(commentId);

  if (!parent || parent.isDeleted) {
    throw new ApiError(httpStatus.NOT_FOUND, "Parent comment not found");
  }

  const reply = await Comment.create({
    blog: parent.blog,
    parent: parent._id,
    author: userId,
    content,
  });

  logger.info(`Reply created for comment ${commentId}`);

  return reply;
};

export const getBlogComments = async (blogId) => {
  const comments = await Comment.aggregate([
    {
      $match: {
        blog: new mongoose.Types.ObjectId(blogId),
        parent: null,
        status: "visible",
        isDeleted: false,
      },
    },

    {
      $lookup: {
        from: "comments",
        localField: "_id",
        foreignField: "parent",
        as: "replies",
      },
    },

    {
      $lookup: {
        from: "users",
        localField: "author",
        foreignField: "_id",
        as: "author",
      },
    },

    {
      $unwind: "$author",
    },

    {
      $sort: {
        createdAt: -1,
      },
    },
  ]);

  return comments;
};

export const deleteComment = async (commentId, userId) => {
  const comment = await Comment.findById(commentId);

  if (!comment) {
    throw new ApiError(httpStatus.NOT_FOUND, "Comment not found");
  }

  if (comment.author.toString() !== userId.toString()) {
    throw new ApiError(
      httpStatus.FORBIDDEN,
      "Not authorized to delete this comment",
    );
  }

  comment.isDeleted = true;
  comment.deletedAt = new Date();

  await comment.save();

  logger.warn(`Comment ${commentId} deleted`);

  return { message: "Comment deleted successfully" };
};

export const likeComment = async (commentId) => {
  const comment = await Comment.findById(commentId);

  if (!comment) {
    throw new ApiError(httpStatus.NOT_FOUND, "Comment not found");
  }

  comment.likes += 1;

  await comment.save();

  return {
    likes: comment.likes,
  };
};
