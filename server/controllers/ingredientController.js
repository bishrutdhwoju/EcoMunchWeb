import { Ingredient, RecipeIngredient } from "../models/index.js";

/**
 * Get all ingredients
 * GET /api/ingredients
 */
export const getAllIngredients = async (req, res) => {
  try {
    const ingredients = await Ingredient.findAll({
      order: [["name", "ASC"]],
    });

    // Get usage count for each ingredient
    const ingredientsWithCount = await Promise.all(
      ingredients.map(async (ing) => {
        const usedIn = await RecipeIngredient.count({ where: { ingredientId: ing.id } });
        return {
          ...ing.toJSON(),
          usedIn,
        };
      })
    );

    res.status(200).json({
      success: true,
      ingredients: ingredientsWithCount,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching ingredients.",
      error: error.message,
    });
  }
};

/**
 * Create ingredient (admin only)
 * POST /api/ingredients
 */
export const createIngredient = async (req, res) => {
  try {
    const { name, category } = req.body;

    if (!name) {
      return res.status(400).json({
        success: false,
        message: "Ingredient name is required.",
      });
    }

    const existing = await Ingredient.findOne({ where: { name } });
    if (existing) {
      return res.status(400).json({
        success: false,
        message: "Ingredient already exists.",
      });
    }

    const ingredient = await Ingredient.create({ 
      name, 
      category: category || "Other" 
    });

    res.status(201).json({
      success: true,
      message: "Ingredient created.",
      ingredient,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error creating ingredient.",
      error: error.message,
    });
  }
};

/**
 * Update ingredient (admin only)
 * PUT /api/ingredients/:id
 */
export const updateIngredient = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, category } = req.body;

    const ingredient = await Ingredient.findByPk(id);
    if (!ingredient) {
      return res.status(404).json({ success: false, message: "Ingredient not found." });
    }

    if (name) ingredient.name = name;
    if (category) ingredient.category = category;
    await ingredient.save();

    res.status(200).json({
      success: true,
      message: "Ingredient updated.",
      ingredient,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error updating ingredient.",
      error: error.message,
    });
  }
};

/**
 * Delete ingredient (admin only)
 * DELETE /api/ingredients/:id
 */
export const deleteIngredient = async (req, res) => {
  try {
    const { id } = req.params;

    const ingredient = await Ingredient.findByPk(id);
    if (!ingredient) {
      return res.status(404).json({ success: false, message: "Ingredient not found." });
    }

    await ingredient.destroy();

    res.status(200).json({
      success: true,
      message: "Ingredient deleted.",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error deleting ingredient.",
      error: error.message,
    });
  }
};
