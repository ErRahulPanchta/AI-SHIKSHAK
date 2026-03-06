import asyncHandler from "../../utils/asyncHandler.js";
import ApiResponse from "../../utils/ApiResponse.js";
import ApiError from "../../utils/ApiError.js";
import refreshService from "./refresh.service.js";

export const refresh = asyncHandler(async (req, res) => {

  const refreshToken = req.cookies.refreshToken;

  if (!refreshToken) {
    throw new ApiError(401, "Refresh token missing");
  }

  const tokens = await refreshService.refreshTokenService(refreshToken);

  res
    .cookie("accessToken", tokens.accessToken, {
      httpOnly: true,
      sameSite: "strict"
    })
    .cookie("refreshToken", tokens.refreshToken, {
      httpOnly: true,
      sameSite: "strict"
    })
    .status(200)
    .json(new ApiResponse(200, {}, "Token refreshed"));

});