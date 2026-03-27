import { create } from "zustand";
import api from "../services/api";

const useAuthStore = create((set) => ({
  user: null,
  isAuthenticated: false,
  loading: true, // only for initial load

  setUser: (user) =>
    set({
      user,
      isAuthenticated: true,
      loading: false,
    }),

  login: async (credentials) => {
    try {
      await api.post("/auth/login", credentials);

      const res = await api.get("/auth/me");

      set({
        user: res.data.data,
        isAuthenticated: true,
        loading: false,
      });

      return { success: true };
    } catch (error) {
      return {
        success: false,
        message: error?.response?.data?.message || "Login failed",
      };
    }
  },

  logout: async () => {
    try {
      await api.post("/auth/logout");
    } catch {}

    set({
      user: null,
      isAuthenticated: false,
    });
  },

  fetchUser: async () => {
    try {
      const res = await api.get("/auth/me");

      set({
        user: res.data.data,
        isAuthenticated: true,
        loading: false,
      });
    } catch (error) {
      set({
        user: null,
        isAuthenticated: false,
        loading: false,
      });
    }
  },
}));

export default useAuthStore;
