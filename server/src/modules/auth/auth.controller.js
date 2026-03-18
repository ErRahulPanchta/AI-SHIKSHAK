import authService from "./auth.service.js";
import ApiResponse from "../../utils/ApiResponse.js";
import asyncHandler from "../../utils/asyncHandler.js";
import otpService from "./otp.service.js";

//register
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

//login
export const login = asyncHandler(async (req, res) => {
  const { user, accessToken, refreshToken } = await authService.loginUser(
    req.body,
  );

  res
    .cookie("accessToken", accessToken, {
      httpOnly: true,
      sameSite: "strict",
      secure: false,
      maxAge: 15 * 60 * 1000,
    })
    .cookie("refreshToken", refreshToken, {
      httpOnly: true,
      sameSite: "strict",
      secure: false,
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

//logout
export const logout = asyncHandler(async (req, res) => {
  const refreshToken = req.cookies.refreshToken;

  if (refreshToken) {
    await authService.logoutUser(refreshToken);
  }

  res.clearCookie("accessToken");
  res.clearCookie("refreshToken");

  res.status(200).json(new ApiResponse(200, {}, "Logout successful"));
});

//getuser
export const me = asyncHandler(async (req, res) => {
  const user = await authService.getMe(req.user.id);

  res.status(200).json(new ApiResponse(200, user, "User profile"));
});

//request otp
export const requestOtp = asyncHandler(async (req, res) => {
  const { email } = req.body;

  await otpService.requestOTP(email);

  res.status(200).json(new ApiResponse(200, null, "OTP sent successfully"));
});

//verify otp
export const verifyOtp = asyncHandler(async (req, res) => {
  const { email, otp } = req.body;

  await otpService.verifyOTP(email, otp);

  res.status(200).json(new ApiResponse(200, null, "Email verified"));
});

// forgot password
export const forgotPassword = asyncHandler(async (req, res) => {

  const { email } = req.body;

  await authService.forgotPassword(email);

  res.status(200).json(
    new ApiResponse(200, null, "OTP sent for password reset")
  );
});

// reset password
export const resetPassword = asyncHandler(async (req, res) => {

  const { email, otp, newPassword } = req.body;

  await authService.resetPassword(email, otp, newPassword);

  res.status(200).json(
    new ApiResponse(200, null, "Password reset successful")
  );
});
