import api from "./api";

// CREATE BLOG
export const createBlog = (data) => {
  return api.post("/blogs", data);
};

// SUBMIT BLOG
export const submitBlog = (blogId) => {
  return api.patch(`/blogs/${blogId}/submit`);
};

// GET ALL BLOGS
export const getBlogs = () => {
  return api.get("/blogs");
};

// GET SINGLE BLOG
export const getBlogBySlug = (slug) => {
  return api.get(`/blogs/${slug}`);
};

// GET MY BLOGS
export const getMyBlogs = (userId) => {
  return api.get(`/blogs/author/${userId}`);
};

// UPDATE BLOG
export const updateBlog = (blogId, data) => {
  return api.patch(`/blogs/${blogId}`, data);
};

export const getBlogById = (id) => {
  return api.get(`/blogs/id/${id}`);
};