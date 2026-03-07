import { z } from "zod";

export const updateUserSchema = z.object({
  body: z.object({
    name: z.string().min(2).max(50).optional(),
    bio: z.string().max(300).optional(),
  }),
  params: z.object({}).optional(),
  query: z.object({}).optional(),
});

export const updateRoleSchema = z.object({
  params: z.object({
    id: z.string().length(24),
  }),
  body: z.object({
    role: z.enum(["user", "admin"]),
  }),
  query: z.object({}).optional(),
});