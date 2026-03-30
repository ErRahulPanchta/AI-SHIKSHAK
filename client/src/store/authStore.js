import { create } from "zustand";
import api from "../services/api";

const useAuthStore = create((set) => ({
  user: null,
  isAuthenticated: false,
  loading: true, 

  setUser: (user) =>
    set({
      user,
      isAuthenticated: true,
      loading: false,
    }),

  login: async (credentials) => {
    try {
      await api.post("/api/auth/login", credentials);

      const res = await api.get("/api/auth/me");

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
      await api.post("/api/auth/logout");
    } catch {}

    set({
      user: null,
      isAuthenticated: false,
    });
  },

  fetchUser: async () => {
    try {
      const res = await api.get("/api/auth/me");

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
