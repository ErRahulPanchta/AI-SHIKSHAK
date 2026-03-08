import * as commentService from "./comment.service.js";
import ApiResponse from "../../utils/ApiResponse.js";
import asyncHandler from "../../utils/asyncHandler.js";

export const createComment = asyncHandler(async (req, res) => {
  const comment = await commentService.createComment(
    req.params.blogId,
    req.user.id,
    req.body.content,
  );

  res
    .status(201)
    .json(new ApiResponse(201, comment, "Comment created successfully"));
});

export const replyComment = asyncHandler(async (req, res) => {
  const reply = await commentService.replyComment(
    req.params.commentId,
    req.user.id,
    req.body.content,
  );

  res.status(201).json(new ApiResponse(201, reply, "Reply added successfully"));
});

export const getBlogComments = asyncHandler(async (req, res) => {
  const comments = await commentService.getBlogComments(req.params.blogId);

  res.json(new ApiResponse(200, comments));
});

export const deleteComment = asyncHandler(async (req, res) => {
  const result = await commentService.deleteComment(
    req.params.commentId,
    req.user.id,
  );

  res.json(new ApiResponse(200, result));
});

export const likeComment = asyncHandler(async (req, res) => {
  const result = await commentService.likeComment(req.params.commentId);

  res.json(new ApiResponse(200, result));
});
