import { create } from "zustand";
import { loginUser, logoutUser, getMe } from "../services/auth.service";

const useAuthStore = create((set) => ({
  user: null,
  loading: false,
  isAuthenticated: false,

  login: async (data) => {
    try {
      set({ loading: true });

      const res = await loginUser(data);

      set({
        user: res.data.data,
        isAuthenticated: true,
      });

      return { success: true };
    } catch (error) {
      return {
        success: false,
        message:
          error?.response?.data?.message || "Login failed",
      };
    } finally {
      set({ loading: false });
    }
  },

  fetchUser: async () => {
    try {
      const res = await getMe();

      set({
        user: res.data.data,
        isAuthenticated: true,
      });
    } catch {
      set({
        user: null,
        isAuthenticated: false,
      });
    }
  },

  logout: async () => {
    try {
      await logoutUser();
    } catch {}

    set({
      user: null,
      isAuthenticated: false,
    });
  },
}));

export default useAuthStore;