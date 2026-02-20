import api from "./api";

const adminService = {
  // Users
  getUsers: async () => {
    const response = await api.get("/admin/users");
    return response.data;
  },

  updateUserRole: async (userId, role) => {
    const response = await api.put(`/admin/users/${userId}/role`, { role });
    return response.data;
  },

  deleteUser: async (userId) => {
    const response = await api.delete(`/admin/users/${userId}`);
    return response.data;
  },

  // Recipes (admin view)
  getAllRecipes: async (status = "all") => {
    const response = await api.get("/recipes/admin/all", { params: { status } });
    return response.data;
  },

  updateRecipeStatus: async (recipeId, status) => {
    const response = await api.put(`/recipes/${recipeId}/status`, { status });
    return response.data;
  },

  // Categories
  getCategories: async () => {
    const response = await api.get("/categories");
    return response.data;
  },

  createCategory: async (name, description) => {
    const response = await api.post("/categories", { name, description });
    return response.data;
  },

  updateCategory: async (id, name, description) => {
    const response = await api.put(`/categories/${id}`, { name, description });
    return response.data;
  },

  deleteCategory: async (id) => {
    const response = await api.delete(`/categories/${id}`);
    return response.data;
  },

  // Ingredients
  getIngredients: async () => {
    const response = await api.get("/ingredients");
    return response.data;
  },

  createIngredient: async (name, category) => {
    const response = await api.post("/ingredients", { name, category });
    return response.data;
  },

  updateIngredient: async (id, name, category) => {
    const response = await api.put(`/ingredients/${id}`, { name, category });
    return response.data;
  },

  deleteIngredient: async (id) => {
    const response = await api.delete(`/ingredients/${id}`);
    return response.data;
  },
};

export default adminService;
