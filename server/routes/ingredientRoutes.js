import express from "express";
import {
  getAllIngredients,
  createIngredient,
  updateIngredient,
  deleteIngredient,
} from "../controllers/ingredientController.js";
import { verifyToken, isAdmin } from "../middlewares/authMiddleware.js";

const router = express.Router();

// Public route
router.get("/", getAllIngredients);

// Admin-only routes
router.post("/", verifyToken, isAdmin, createIngredient);
router.put("/:id", verifyToken, isAdmin, updateIngredient);
router.delete("/:id", verifyToken, isAdmin, deleteIngredient);

export default router;
