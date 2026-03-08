import Category from "./category.model.js";
import ApiError from "../../utils/ApiError.js";
import httpStatus from "../../constant/httpStatus.js";
import logger from "../../utils/logger.js";

export const createCategory = async (data) => {
  const existing = await Category.findOne({
    name: data.name,
    isDeleted: false,
  });

  if (existing) {
    throw new ApiError(httpStatus.CONFLICT, "Category already exists");
  }

  const category = await Category.create(data);

  logger.info(`Category created: ${category.name}`);

  return category;
};

export const updateCategory = async (categoryId, data) => {
  const category = await Category.findById(categoryId);

  if (!category || category.isDeleted) {
    throw new ApiError(httpStatus.NOT_FOUND, "Category not found");
  }

  Object.assign(category, data);

  await category.save();

  logger.info(`Category updated: ${categoryId}`);

  return category;
};

export const getCategories = async () => {
  const categories = await Category.find({
    isDeleted: false,
    isActive: true,
  }).sort({ order: 1, name: 1 });

  return categories;
};

export const getCategoryBySlug = async (slug) => {
  const category = await Category.findOne({
    slug,
    isDeleted: false,
    isActive: true,
  });

  if (!category) {
    throw new ApiError(httpStatus.NOT_FOUND, "Category not found");
  }

  return category;
};

export const getCategoryById = async (categoryId) => {
  const category = await Category.findById(categoryId);

  if (!category || category.isDeleted) {
    throw new ApiError(httpStatus.NOT_FOUND, "Category not found");
  }

  return category;
};

export const getChildCategories = async (parentId) => {
  const children = await Category.find({
    parent: parentId,
    isDeleted: false,
    isActive: true,
  }).sort({ order: 1 });

  return children;
};

export const deleteCategory = async (categoryId) => {
  const category = await Category.findById(categoryId);

  if (!category) {
    throw new ApiError(httpStatus.NOT_FOUND, "Category not found");
  }

  category.isDeleted = true;
  category.deletedAt = new Date();

  await category.save();

  logger.warn(`Category deleted: ${categoryId}`);

  return {
    message: "Category deleted successfully",
  };
};
