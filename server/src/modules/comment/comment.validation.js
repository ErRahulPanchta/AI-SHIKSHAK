import { z } from "zod";

const objectId = z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid ObjectId");

export const createCommentSchema = z.object({
  params: z.object({
    blogId: objectId,
  }),

  body: z.object({
    content: z
      .string()
      .trim()
      .min(1, "Comment cannot be empty")
      .max(1000, "Comment cannot exceed 1000 characters"),
  }),
});

export const replyCommentSchema = z.object({
  params: z.object({
    commentId: objectId,
  }),

  body: z.object({
    content: z
      .string()
      .trim()
      .min(1, "Reply cannot be empty")
      .max(1000, "Reply cannot exceed 1000 characters"),
  }),
});

export const deleteCommentSchema = z.object({
  params: z.object({
    commentId: objectId,
  }),
});

export const likeCommentSchema = z.object({
  params: z.object({
    commentId: objectId,
  }),
});

export const getBlogCommentsSchema = z.object({
  params: z.object({
    blogId: objectId,
  }),
});
