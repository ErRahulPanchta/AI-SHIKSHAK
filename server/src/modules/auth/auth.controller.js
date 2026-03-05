import authService from "./auth.service.js";
import ApiResponse from "../../utils/ApiResponse.js";
import asyncHandler from "../../utils/asyncHandler.js";

export const register = asyncHandler(async (req, res) => {
  const user = await authService.registerUser(req.body);

  res.status(201).json(
    new ApiResponse(
      201,
      {
        id: user._id,
        name: user.name,
        email: user.email,
      },
      "User registered successfully",
    ),
  );
});
