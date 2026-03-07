import express from "express";
import userController from "./user.controller.js";
import authMiddleware from "../../middleware/auth.middleware.js";
import roleMiddleware from "../../middleware/role.middleware.js";
import validate from "../../middleware/validation.middleware.js";
import { uploadAvatar } from "../../middleware/upload.middleware.js";
import { updateUserSchema, updateRoleSchema } from "./user.validation.js";

const router = express.Router();

router.patch(
  "/me",
  authMiddleware,
  validate(updateUserSchema),
  userController.updateProfile,
);

router.patch(
  "/avatar",
  authMiddleware,
  uploadAvatar.single("avatar"),
  userController.updateAvatar,
);

router.patch(
  "/:id/role",
  authMiddleware,
  validate(updateRoleSchema),
  roleMiddleware("admin"),
  userController.updateUserRole,
);

router.delete(
  "/:id",
  authMiddleware,
  roleMiddleware("admin"),
  userController.deleteUser,
);

export default router;
