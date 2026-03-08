import { z } from "zod";

const seoSchema = z.object({
  metaTitle: z
    .string()
    .trim()
    .max(60, "Meta title cannot exceed 60 characters")
    .optional(),

  metaDescription: z
    .string()
    .trim()
    .max(160, "Meta description cannot exceed 160 characters")
    .optional(),

  keywords: z.array(z.string().trim().toLowerCase()).optional(),
});

export const createCategorySchema = z.object({
  body: z.object({
    name: z
      .string()
      .trim()
      .min(2, "Category name must be at least 2 characters")
      .max(100),

    description: z.string().trim().max(300).optional(),

    image: z.string().url("Image must be a valid URL").optional(),

    icon: z.string().optional(),

    parent: z.string().optional(),

    order: z.number().int().min(0).optional(),

    isActive: z.boolean().optional(),

    seo: seoSchema.optional(),
  }),
});

export const updateCategorySchema = z.object({
  params: z.object({
    categoryId: z.string(),
  }),

  body: z.object({
    name: z.string().trim().min(2).max(100).optional(),

    description: z.string().trim().max(300).optional(),

    image: z.string().url().optional(),

    icon: z.string().optional(),

    parent: z.string().optional(),

    order: z.number().int().min(0).optional(),

    isActive: z.boolean().optional(),

    seo: seoSchema.optional(),
  }),
});

export const deleteCategorySchema = z.object({
  params: z.object({
    categoryId: z.string(),
  }),
});

export const getCategoryBySlugSchema = z.object({
  params: z.object({
    slug: z.string(),
  }),
});
