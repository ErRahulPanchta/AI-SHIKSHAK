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
 *     summary: Get all blogs (with filters, pagination)
 *     tags: [Blog]
 */
router.get("/", blogController.getBlogs);

/**
 * @swagger
 * /blogs/search:
 *   get:
 *     summary: Search blogs
 *     tags: [Blog]
 */
router.get("/search", blogController.searchBlogs);

/**
 * @swagger
 * /blogs/trending:
 *   get:
 *     summary: Get trending blogs
 *     tags: [Blog]
 */
router.get("/trending", blogController.getTrendingBlogs);

/**
 * @swagger
 * /blogs/{slug}/recommendations:
 *   get:
 *     summary: Get recommended blogs
 *     tags: [Blog]
 */
router.get("/:slug/recommendations", blogController.getRecommendedBlogs);

/**
 * @swagger
 * /blogs/{slug}/related:
 *   get:
 *     summary: Get related blogs
 *     tags: [Blog]
 */
router.get("/:slug/related", blogController.getRelatedBlogs);

/**
 * @swagger
 * /blogs/author/{userId}:
 *   get:
 *     summary: Get blogs by author
 *     tags: [Blog]
 */
router.get("/author/:userId", blogController.getBlogsByAuthor);

/**
 * @swagger
 * /blogs/{slug}:
 *   get:
 *     summary: Get blog by slug
 *     tags: [Blog]
 */
router.get("/:slug", viewMiddleware, blogController.getBlogBySlug);

/**
 * @swagger
 * /blogs/id/{blogId}:
 *   get:
 *     summary: Get blog by ID (owner only)
 *     tags: [Blog]
 */
router.get("/id/:blogId", auth, blogController.getBlogById);

/**
 * @swagger
 * /blogs:
 *   post:
 *     summary: Create blog
 *     tags: [Blog]
 */
router.post("/", auth, validate(createBlogSchema), blogController.createBlog);

/**
 * @swagger
 * /blogs/{blogId}:
 *   patch:
 *     summary: Update blog
 *     tags: [Blog]
 */
router.patch(
  "/:blogId",
  auth,
  validate(updateBlogSchema),
  blogController.updateBlog,
);

/**
 * @swagger
 * /blogs/{blogId}/submit:
 *   patch:
 *     summary: Submit blog for review
 *     tags: [Blog]
 */
router.patch(
  "/:blogId/submit",
  auth,
  validate(submitBlogSchema),
  blogController.submitBlog,
);

/**
 * @swagger
 * /blogs/{blogId}:
 *   delete:
 *     summary: Delete blog
 *     tags: [Blog]
 */
router.delete("/:blogId", auth, blogController.deleteBlog);

/**
 * @swagger
 * /blogs/{blogId}/like:
 *   post:
 *     summary: Like blog
 *     tags: [Blog]
 */
router.post("/:blogId/like", auth, blogController.likeBlog);

/**
 * @swagger
 * /blogs/admin/{blogId}/approve:
 *   patch:
 *     summary: Approve blog
 *     tags: [Blog]
 */
router.patch(
  "/admin/:blogId/approve",
  auth,
  role("admin"),
  validate(approveBlogSchema),
  blogController.approveBlog,
);

/**
 * @swagger
 * /blogs/admin/{blogId}/reject:
 *   patch:
 *     summary: Reject blog
 *     tags: [Blog]
 */
router.patch(
  "/admin/:blogId/reject",
  auth,
  role("admin"),
  validate(rejectBlogSchema),
  blogController.rejectBlog,
);

export default router;
