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

export const login = asyncHandler(async (req, res) => {
  const { user, accessToken, refreshToken } = await authService.loginUser(req.body,);
  res
    .cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: false,
      sameSite: "strict",
      maxAge: 15 * 60 * 1000,
    })
    .cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: false,
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    })
    .status(200)
    .json(
      new ApiResponse(
        200,
        {
          id: user._id,
          name: user.name,
          email: user.email,
        },
        "Login successful",
      ),
    );
});

export const logout = asyncHandler(async (req, res) => {

  const refreshToken = req.cookies.refreshToken;

  if (refreshToken) {
    await authService.logoutUser(refreshToken);
  }

  res.clearCookie("accessToken");
  res.clearCookie("refreshToken");

  res.status(200).json(
    new ApiResponse(200, {}, "Logout successful")
  );

});

export const me = asyncHandler(async (req, res) => {

  const user = await authService.getMe(req.user.id);

  res.status(200).json(
    new ApiResponse(200, user, "User profile")
  );

});