import User from "./user.model.js";
import ApiError from "../../utils/ApiError.js";
import { v2 as cloudinary } from "cloudinary";

const updateProfile = async (userId, data) => {
  const user = await User.findById(userId);

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  if (data.name !== undefined) {
    user.name = data.name;
  }

  if (data.bio !== undefined) {
    user.bio = data.bio;
  }

  await user.save();

  return user;
};

const updateAvatar = async (userId, file) => {
  if (!file) {
    throw new ApiError(400, "Avatar file is required");
  }

  const user = await User.findById(userId);

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  const upload = await new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: "avatars" },
      (error, result) => {
        if (error) reject(error);
        else resolve(result);
      },
    );

    stream.end(file.buffer);
  });

  user.avatar = upload.secure_url;

  await user.save();

  return user;
};

const updateUserRole = async (userId, role) => {
  const user = await User.findById(userId);

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  user.role = role;

  await user.save();

  return user;
};

const deleteUser = async (userId) => {
  const user = await User.findById(userId);

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  await User.deleteOne({ _id: userId });
};

export default {
  updateProfile,
  updateUserRole,
  deleteUser,
  updateAvatar,
};
