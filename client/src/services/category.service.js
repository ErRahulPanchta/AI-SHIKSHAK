import api from "./api";

export const getCategories = () => {
  return api.get("/api/categories");
};