import axios from "axios";
import useAuthStore from "../store/authStore";

const api = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL,
  withCredentials: true,
});

// 🔥 RESPONSE INTERCEPTOR
api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const originalRequest = error.config;

    // if 401 and not retried
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        await api.post("/auth/refresh");
        await useAuthStore.getState().fetchUser();
        return api(originalRequest); // retry
      } catch (err) {
        const logout = useAuthStore.getState().logout;
        logout();

        window.location.href = "/login";
      }
    }

    return Promise.reject(error);
  },
);

export default api;
