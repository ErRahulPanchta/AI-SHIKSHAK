import { z } from "zod";

const contentBlockSchema = z.object({
  type: z.enum([
    "paragraph",
    "heading",
    "image",
    "video",
    "code",
    "quote",
    "table",
    "list",
  ]),

  text: z.string().trim().optional(),

  level: z.number().int().min(1).max(6).optional(),

  url: z.string().url().optional(),

  caption: z.string().trim().optional(),

  language: z.string().optional(),

  items: z.array(z.string()).optional(),
});

const seoSchema = z.object({
  metaTitle: z.string().trim().max(60).optional(),

  metaDescription: z.string().trim().max(160).optional(),

  keywords: z.array(z.string()).optional(),
});

export const createBlogSchema = z.object({
  body: z.object({
    title: z
      .string()
      .trim()
      .min(5, "Title must be at least 5 characters")
      .max(150),

    excerpt: z.string().trim().max(300).optional(),

    coverImage: z.string().url().optional(),

    category: z.string().optional(),

    tags: z.array(z.string()).optional(),

    content: z
      .array(contentBlockSchema)
      .min(1, "Blog must contain at least one content block"),

    seo: seoSchema.optional(),
  }),
});

export const updateBlogSchema = z.object({
  params: z.object({
    blogId: z.string(),
  }),

  body: z.object({
    title: z.string().trim().min(5).max(150).optional(),

    excerpt: z.string().trim().max(300).optional(),

    coverImage: z.string().url().optional(),

    category: z.string().optional(),

    tags: z.array(z.string()).optional(),

    content: z.array(contentBlockSchema).optional(),

    seo: seoSchema.optional(),
  }),
});

export const submitBlogSchema = z.object({
  params: z.object({
    blogId: z.string(),
  }),
});

export const approveBlogSchema = z.object({
  params: z.object({
    blogId: z.string(),
  }),
});

export const rejectBlogSchema = z.object({
  params: z.object({
    blogId: z.string(),
  }),

  body: z.object({
    rejectionReason: z
      .string()
      .trim()
      .min(5, "Rejection reason required")
      .max(500),
  }),
});

