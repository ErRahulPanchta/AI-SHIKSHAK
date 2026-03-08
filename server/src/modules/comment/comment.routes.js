import { Router } from "express";

import * as commentController from "./comment.controller.js";

import {
  createCommentSchema,
  replyCommentSchema,
  deleteCommentSchema,
  likeCommentSchema,
  getBlogCommentsSchema,
} from "./comment.validation.js";

import validate from "../../middleware/validation.middleware.js";
import auth from "../../middleware/auth.middleware.js";

const router = Router();

router.get(
  "/blogs/:blogId/comments",
  validate(getBlogCommentsSchema),
  commentController.getBlogComments,
);

// Create comment
router.post(
  "/blogs/:blogId/comments",
  auth,
  validate(createCommentSchema),
  commentController.createComment,
);

// Reply to comment
router.post(
  "/comments/:commentId/reply",
  auth,
  validate(replyCommentSchema),
  commentController.replyComment,
);

// Delete comment
router.delete(
  "/comments/:commentId",
  auth,
  validate(deleteCommentSchema),
  commentController.deleteComment,
);

// Like comment
router.post(
  "/comments/:commentId/like",
  auth,
  validate(likeCommentSchema),
  commentController.likeComment,
);

export default router;
