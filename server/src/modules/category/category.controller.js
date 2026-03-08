import * as categoryService from "./category.service.js";
import ApiResponse from "../../utils/ApiResponse.js";
import asyncHandler from "../../utils/asyncHandler.js";

export const createCategory = asyncHandler(async (req, res) => {
  const category = await categoryService.createCategory(req.body);

  res
    .status(201)
    .json(new ApiResponse(201, category, "Category created successfully"));
});

export const updateCategory = asyncHandler(async (req, res) => {
  const category = await categoryService.updateCategory(
    req.params.categoryId,
    req.body,
  );

  res.json(new ApiResponse(200, category, "Category updated successfully"));
});

export const getCategories = asyncHandler(async (req, res) => {
  const categories = await categoryService.getCategories();

  res.json(new ApiResponse(200, categories));
});

export const getCategoryBySlug = asyncHandler(async (req, res) => {
  const category = await categoryService.getCategoryBySlug(req.params.slug);

  res.json(new ApiResponse(200, category));
});

export const getCategoryById = asyncHandler(async (req, res) => {
  const category = await categoryService.getCategoryById(req.params.categoryId);

  res.json(new ApiResponse(200, category));
});

export const getChildCategories = asyncHandler(async (req, res) => {
  const children = await categoryService.getChildCategories(
    req.params.parentId,
  );

  res.json(new ApiResponse(200, children));
});

export const deleteCategory = asyncHandler(async (req, res) => {
  const result = await categoryService.deleteCategory(req.params.categoryId);

  res.json(new ApiResponse(200, result));
});
