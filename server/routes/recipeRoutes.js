import express from "express";
import {
  createRecipe,
  getMyRecipes,
  updateRecipe,
  deleteRecipe,
  getAllRecipes,
  getRecipeById,
  getAllRecipesAdmin,
  updateRecipeStatus
} from "../controllers/recipeController.js";
import { verifyToken, isAdmin } from "../middlewares/authMiddleware.js";
import { upload } from "../middlewares/uploadMiddleware.js";

const router = express.Router();

// Public routes
router.get("/", getAllRecipes);

// Protected routes - need auth first
router.get("/my/all", verifyToken, getMyRecipes);
router.post("/", verifyToken, upload.single("image"), createRecipe);

// Admin routes (must be before /:id to avoid collision)
router.get("/admin/all", verifyToken, isAdmin, getAllRecipesAdmin);
router.put("/:id/status", verifyToken, isAdmin, updateRecipeStatus);

// These routes with :id should come last
router.get("/:id", getRecipeById);
router.put("/:id", verifyToken, upload.single("image"), updateRecipe);
router.delete("/:id", verifyToken, deleteRecipe);

export default router;
