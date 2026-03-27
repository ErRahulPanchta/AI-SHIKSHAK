import { Router } from "express";

import * as blogController from "./blog.controller.js";
import {
  createBlogSchema,
  updateBlogSchema,
  submitBlogSchema,
  approveBlogSchema,
  rejectBlogSchema,
} from "./blog.validation.js";

import validate from "../../middleware/validation.middleware.js";
import auth from "../../middleware/auth.middleware.js";
import role from "../../middleware/role.middleware.js";
import viewMiddleware from "../../middleware/view.middleware.js";

const router = Router();

// Get all blogs

/**
 * @swagger
 * tags:
 *   name: Blog
 *   description: Blog APIs
 */

/**
 * @swagger
 * /blogs:
 *   get:
 *     summary: Get all blogs
 *     tags: [Blog]
 *     responses:
 *       200:
 *         description: List of blogs
 */
router.get("/", blogController.getBlogs);

//search a blog
router.get("/search", blogController.searchBlogs);

//trending
router.get("/trending", blogController.getTrendingBlogs);

//recommed
router.get("/:slug/recommendations", blogController.getRecommendedBlogs);

router.get("/id/:blogId", auth, blogController.getBlogById);

// Get blog by slug
router.get("/:slug", viewMiddleware, blogController.getBlogBySlug);

// Get related blogs
router.get("/:slug/related", blogController.getRelatedBlogs);

// Get blogs by author
router.get("/author/:userId", blogController.getBlogsByAuthor);

// Create blog

/**
 * @swagger
 * /blogs:
 *   post:
 *     summary: Create a blog
 *     tags: [Blog]
 *     responses:
 *       201:
 *         description: Blog created
 */
router.post("/", auth, validate(createBlogSchema), blogController.createBlog);

// Update blog
router.patch(
  "/:blogId",
  auth,
  validate(updateBlogSchema),
  blogController.updateBlog,
);

// Submit blog for review
router.patch(
  "/:blogId/submit",
  auth,
  validate(submitBlogSchema),
  blogController.submitBlog,
);

// Delete blog
router.delete("/:blogId", auth, blogController.deleteBlog);

// Like blog
router.post("/:blogId/like", auth, blogController.likeBlog);

// Approve blog
router.patch(
  "/admin/:blogId/approve",
  auth,
  role("admin"),
  validate(approveBlogSchema),
  blogController.approveBlog,
);

// Reject blog
router.patch(
  "/admin/:blogId/reject",
  auth,
  role("admin"),
  validate(rejectBlogSchema),
  blogController.rejectBlog,
);

export default router;
