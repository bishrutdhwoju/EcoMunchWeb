import axios from "axios";

// Create axios instance with default config
const api = axios.create({
  baseURL: "http://localhost:8000/api",
  withCredentials: true, // Send cookies with requests
  headers: {
    "Content-Type": "application/json",
  },
});

// Auth API calls
export const authAPI = {
  register: (data) => api.post("/auth/register", data),
  login: (data) => api.post("/auth/login", data),
  logout: () => api.post("/auth/logout"),
  getMe: () => api.get("/auth/me"),
  updateProfile: (data) => api.put("/auth/profile", data, {
    headers: { "Content-Type": "multipart/form-data" },
  }),
  changePassword: (currentPassword, newPassword) =>
    api.put("/auth/change-password", { currentPassword, newPassword }),
  // Forgot password
  getSecurityQuestion: (email) => api.post("/auth/forgot-password/question", { email }),
  verifySecurityAnswer: (email, securityAnswer) =>
    api.post("/auth/forgot-password/verify", { email, securityAnswer }),
  resetPassword: (resetToken, newPassword) =>
    api.post("/auth/forgot-password/reset", { resetToken, newPassword }),
};

// Recipe API calls (placeholder for future use)
export const recipeAPI = {
  getAll: (params) => api.get("/recipes", { params }),
  getById: (id) => api.get(`/recipes/${id}`),
  create: (data) => api.post("/recipes", data),
  update: (id, data) => api.put(`/recipes/${id}`, data),
  delete: (id) => api.delete(`/recipes/${id}`),
};

// Bookmark API calls
export const bookmarkAPI = {
  getMyBookmarks: () => api.get("/bookmarks"),
  check: (recipeId) => api.get(`/bookmarks/check/${recipeId}`),
  add: (recipeId) => api.post(`/bookmarks/${recipeId}`),
  remove: (recipeId) => api.delete(`/bookmarks/${recipeId}`),
};

export default api;
