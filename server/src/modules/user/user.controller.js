import asyncHandler from "../../utils/asyncHandler.js";
import ApiResponse from "../../utils/ApiResponse.js";
import userService from "./user.service.js";

const updateProfile = asyncHandler(async (req, res) => {
  const userId = req.user.id;

  const updatedUser = await userService.updateProfile(userId, req.body);

  return res
    .status(200)
    .json(new ApiResponse(200, updatedUser, "Profile updated successfully"));
});

const updateAvatar = asyncHandler(async (req, res) => {
  const userId = req.user.id;

  const user = await userService.updateAvatar(userId, req.file);

  return res
    .status(200)
    .json(new ApiResponse(200, user, "Avatar updated successfully"));
});

const updateUserRole = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { role } = req.body;

  const updatedUser = await userService.updateUserRole(id, role);

  return res
    .status(200)
    .json(new ApiResponse(200, updatedUser, "User role updated"));
});

const deleteUser = asyncHandler(async (req, res) => {
  const { id } = req.params;

  await userService.deleteUser(id);

  return res
    .status(200)
    .json(new ApiResponse(200, null, "User deleted successfully"));
});

export default {
  updateProfile,
  updateUserRole,
  deleteUser,
  updateAvatar,
};
