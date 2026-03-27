import * as blogService from "./blog.service.js";
import ApiResponse from "../../utils/ApiResponse.js";
import asyncHandler from "../../utils/asyncHandler.js";

export const createBlog = asyncHandler(async (req, res) => {
  const blog = await blogService.createBlog(
    req.user.id,
    req.user.role,
    req.body,
  );

  res.status(201).json(new ApiResponse(201, blog, "Blog created successfully"));
});

export const updateBlog = asyncHandler(async (req, res) => {
  const blog = await blogService.updateBlog(
    req.params.blogId,
    req.user.id,
    req.body,
  );

  res.json(new ApiResponse(200, blog, "Blog updated successfully"));
});

export const submitBlog = asyncHandler(async (req, res) => {
  const blog = await blogService.submitBlog(req.params.blogId, req.user.id);

  res.json(new ApiResponse(200, blog, "Blog submitted for review"));
});

export const approveBlog = asyncHandler(async (req, res) => {
  const blog = await blogService.approveBlog(req.params.blogId, req.user.id);

  res.json(new ApiResponse(200, blog, "Blog approved"));
});

export const rejectBlog = asyncHandler(async (req, res) => {
  const blog = await blogService.rejectBlog(
    req.params.blogId,
    req.body.rejectionReason,
  );

  res.json(new ApiResponse(200, blog, "Blog rejected"));
});

export const getBlogById = asyncHandler(async (req, res) => {
  const blog = await blogService.getBlogById(req.params.blogId, req.user.id);

  res.json(new ApiResponse(200, blog));
});

export const getBlogBySlug = asyncHandler(async (req, res) => {
  const blog = await blogService.getBlogBySlug(req.params.slug);

  res.json(new ApiResponse(200, blog));
});

export const getBlogs = asyncHandler(async (req, res) => {
  const result = await blogService.getBlogs(req.query);

  res.json(new ApiResponse(200, result));
});

export const getBlogsByAuthor = asyncHandler(async (req, res) => {
  const result = await blogService.getBlogsByAuthor(
    req.params.userId,
    req.query,
  );

  res.json(new ApiResponse(200, result));
});

export const getRelatedBlogs = asyncHandler(async (req, res) => {
  const blogs = await blogService.getRelatedBlogs(req.params.slug);

  res.json(new ApiResponse(200, blogs));
});

export const deleteBlog = asyncHandler(async (req, res) => {
  const result = await blogService.deleteBlog(req.params.blogId, req.user.id);

  res.json(new ApiResponse(200, result));
});

export const likeBlog = asyncHandler(async (req, res) => {
  const result = await blogService.likeBlog(req.params.blogId);

  res.json(new ApiResponse(200, result));
});

export const searchBlogs = asyncHandler(async (req, res) => {
  const result = await blogService.searchBlogs(req.query);

  res.json(new ApiResponse(200, result));
});

export const getTrendingBlogs = asyncHandler(async (req, res) => {
  const result = await blogService.getTrendingBlogs(req.query);

  res.json(new ApiResponse(200, result));
});

export const getRecommendedBlogs = asyncHandler(async (req, res) => {
  const blogs = await blogService.getRecommendedBlogs(req.params.slug);

  res.json(new ApiResponse(200, blogs));
});
