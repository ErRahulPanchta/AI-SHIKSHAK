import api from "./api.js";

export const registerUser = (data) => {
  return api.post("/api/auth/register", data);
};

export const loginUser = (data) => {
  return api.post("/api/auth/login", data);
};

export const logoutUser = () => {
  return api.post("/api/auth/logout");
};

export const getMe = () => {
  return api.get("/api/auth/me");
};

export const requestOtp = (data) => {
  return api.post("/api/auth/request-otp", data);
};

export const verifyOtp = (data) => {
  return api.post("/api/auth/verify-otp", data);
};