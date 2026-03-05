import bcrypt from "bcrypt";
import User from "../user/user.model.js";
import ApiError from "../../utils/ApiError.js";

const registerUser = async (data) => {
  const { name, email, password } = data;

  const existingUser = await User.findOne({ email });

  if (existingUser) {
    throw new ApiError(409, "User already exists");
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await User.create({
    name,
    email,
    password: hashedPassword,
  });

  return user;
};

export default {
  registerUser,
};
