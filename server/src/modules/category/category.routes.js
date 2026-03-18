import { Router } from "express";

import * as categoryController from "./category.controller.js";

import {
  createCategorySchema,
  updateCategorySchema,
  deleteCategorySchema,
  getCategoryBySlugSchema,
} from "./category.validation.js";

import validate from "../../middleware/validation.middleware.js";
import auth from "../../middleware/auth.middleware.js";
import role from "../../middleware/role.middleware.js";

const router = Router();

// Get all categories

/**
 * @swagger
 * tags:
 *   name: Category
 *   description: Category APIs
 */

/**
 * @swagger
 * /categories:
 *   get:
 *     summary: Get all categories
 *     tags: [Category]
 *     responses:
 *       200:
 *         description: Categories fetched
 */
router.get("/", categoryController.getCategories);

// Get category by slug
router.get(
  "/:slug",
  validate(getCategoryBySlugSchema),
  categoryController.getCategoryBySlug,
);

// Get child categories
router.get("/:parentId/children", categoryController.getChildCategories);

// Create category
router.post(
  "/",
  auth,
  role("admin"),
  validate(createCategorySchema),
  categoryController.createCategory,
);

// Update category
router.patch(
  "/:categoryId",
  auth,
  role("admin"),
  validate(updateCategorySchema),
  categoryController.updateCategory,
);

// Delete category
router.delete(
  "/:categoryId",
  auth,
  role("admin"),
  validate(deleteCategorySchema),
  categoryController.deleteCategory,
);

export default router;
