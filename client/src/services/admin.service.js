import api from "./api";

export const getPendingBlogs = () => {
  return api.get("/blogs?status=pending"); // small backend tweak needed
};

export const approveBlog = (blogId) => {
  return api.patch(`/blogs/admin/${blogId}/approve`);
};

export const rejectBlog = (blogId, reason) => {
  return api.patch(`/blogs/admin/${blogId}/reject`, {
    rejectionReason: reason,
  });
};