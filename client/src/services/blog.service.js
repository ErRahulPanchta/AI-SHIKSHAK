import api from "./api";

// CREATE BLOG
export const createBlog = (data) => {
  return api.post("/api/blogs", data);
};

// SUBMIT BLOG
export const submitBlog = (blogId) => {
  return api.patch(`/api/blogs/${blogId}/submit`);
};

// GET ALL BLOGS (with query support)
export const getBlogs = (params = {}) => {
  return api.get("/api/blogs", { params });
};

// GET SINGLE BLOG
export const getBlogBySlug = (slug) => {
  return api.get(`/api/blogs/${slug}`);
};

// GET BLOG BY ID (for edit/admin)
export const getBlogById = (id) => {
  return api.get(`/api/blogs/id/${id}`);
};

// GET MY BLOGS
export const getMyBlogs = (userId, params = {}) => {
  return api.get(`/api/blogs/author/${userId}`, { params });
};

// UPDATE BLOG
export const updateBlog = (blogId, data) => {
  return api.patch(`/api/blogs/${blogId}`, data);
};

// DELETE BLOG (soft delete)
export const deleteBlog = (blogId) => {
  return api.delete(`/api/blogs/${blogId}`);
};

// LIKE BLOG
export const likeBlog = (blogId) => {
  return api.post(`/api/blogs/${blogId}/like`);
};

// SEARCH BLOGS
export const searchBlogs = (query, params = {}) => {
  return api.get(`/api/blogs/search`, {
    params: { q: query, ...params },
  });
};

// TRENDING BLOGS
export const getTrendingBlogs = (params = {}) => {
  return api.get("/api/blogs/trending", { params });
};

// RELATED BLOGS
export const getRelatedBlogs = (slug) => {
  return api.get(`/api/blogs/${slug}/related`);
};

// RECOMMENDED BLOGS
export const getRecommendedBlogs = (slug) => {
  return api.get(`/api/blogs/${slug}/recommendations`);
};