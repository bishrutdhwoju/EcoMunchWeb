import api from "./api";

const recipeService = {
  // Get all approved recipes
  getAll: async (params) => {
    const response = await api.get("/recipes", { params });
    return response.data;
  },

  // Get single recipe
  getById: async (id) => {
    const response = await api.get(`/recipes/${id}`);
    return response.data;
  },

  // Get user's own recipes
  getMyRecipes: async () => {
    const response = await api.get("/recipes/my/all");
    return response.data;
  },

  // Create new recipe (using FormData for image upload)
  create: async (recipeData) => {
    const formData = new FormData();
    
    // Append all fields to FormData
    Object.keys(recipeData).forEach((key) => {
      if (recipeData[key] !== null && recipeData[key] !== undefined) {
        formData.append(key, recipeData[key]);
      }
    });

    const response = await api.post("/recipes", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  },

  // Update recipe
  update: async (id, recipeData) => {
    const formData = new FormData();
    
    Object.keys(recipeData).forEach((key) => {
      if (recipeData[key] !== null && recipeData[key] !== undefined) {
        formData.append(key, recipeData[key]);
      }
    });

    const response = await api.put(`/recipes/${id}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  },

  // Delete recipe
  delete: async (id) => {
    const response = await api.delete(`/recipes/${id}`);
    return response.data;
  },
};

export default recipeService;
