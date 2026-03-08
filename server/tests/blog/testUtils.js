import jwt from "jsonwebtoken";
import User from "../../src/modules/user/user.model.js";
import Category from "../../src/modules/category/category.model.js";
import Blog from "../../src/modules/blog/blog.model.js";
import { env } from "../../src/config/env.js";

export const createUserAndToken = async (role = "user") => {
  const user = await User.create({
    name: "Test User",
    email: `${role}@test.com`,
    password: "password123",
    role,
  });

  const token = jwt.sign(
    { id: user._id, role: user.role },
    env.JWT_ACCESS_SECRET,
  );

  return { user, token };
};

export const createCategory = async () => {
  return await Category.create({
    name: "Artificial Intelligence",
  });
};

export const createBlog = async (authorId, categoryId) => {
  return await Blog.create({
    title: "AI Basics",
    excerpt: "Intro to AI",
    author: authorId,
    category: categoryId,
    content: [{ type: "paragraph", text: "Artificial intelligence basics" }],
  });
};
