import { Recipe, Category, User } from "../models/index.js";
import { Op } from "sequelize";
import fs from "fs";
import path from "path";

/**
 * Create a new recipe
 * POST /api/recipes
 */
export const createRecipe = async (req, res) => {
  try {
    const {
      title,
      description,
      instructions,
      prepTime,
      cookTime,
      servings,
      difficulty,
      dietary,
      sustainability,
      categoryName,
      ingredients
    } = req.body;

    // Find or create category
    let category = null;
    if (categoryName) {
      [category] = await Category.findOrCreate({
        where: { name: categoryName }
      });
    }

    const recipe = await Recipe.create({
      title,
      description,
      instructions,
      prepTime: parseInt(prepTime),
      cookingTime: parseInt(cookTime),
      servings: parseInt(servings),
      difficulty: difficulty?.toLowerCase(),
      dietary,
      sustainability,
      ingredients,
      imageUrl: req.file ? `/uploads/recipes/${req.file.filename}` : null,
      userId: req.user.id,
      categoryId: category ? category.id : null,
    });

    res.status(201).json({
      success: true,
      message: "Recipe published successfully!",
      recipe
    });
  } catch (error) {
    console.error("Error creating recipe:", error);
    res.status(500).json({
      success: false,
      message: "Error creating recipe.",
      error: error.message
    });
  }
};

/**
 * Get user's recipes
 * GET /api/recipes/my-recipes
 */
export const getMyRecipes = async (req, res) => {
  try {
    const recipes = await Recipe.findAll({
      where: { userId: req.user.id },
      include: [
        { model: Category, as: "category", attributes: ["name"] }
      ],
      order: [["createdAt", "DESC"]]
    });

    res.status(200).json({
      success: true,
      recipes
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching your recipes.",
      error: error.message
    });
  }
};

/**
 * Update a recipe
 * PUT /api/recipes/:id
 */
export const updateRecipe = async (req, res) => {
  try {
    const { id } = req.params;
    const recipe = await Recipe.findByPk(id);

    if (!recipe) {
      return res.status(404).json({ success: false, message: "Recipe not found." });
    }

    // Check ownership
    if (recipe.userId !== req.user.id && req.user.role !== "admin") {
      return res.status(403).json({ success: false, message: "Not authorized to update this recipe." });
    }

    const {
      title,
      description,
      instructions,
      prepTime,
      cookTime,
      cookingTime,
      servings,
      difficulty,
      dietary,
      sustainability,
      categoryName,
      ingredients
    } = req.body;

    // Accept both cookTime (from form) and cookingTime (from direct API)
    const resolvedCookingTime = cookTime || cookingTime;

    // Update category if provided
    if (categoryName) {
      const [category] = await Category.findOrCreate({ where: { name: categoryName } });
      recipe.categoryId = category.id;
    }

    // Update fields
    recipe.title = title || recipe.title;
    recipe.description = description || recipe.description;
    recipe.instructions = instructions || recipe.instructions;
    recipe.prepTime = prepTime ? parseInt(prepTime) : recipe.prepTime;
    recipe.cookingTime = resolvedCookingTime ? parseInt(resolvedCookingTime) : recipe.cookingTime;
    recipe.servings = servings ? parseInt(servings) : recipe.servings;
    recipe.difficulty = difficulty?.toLowerCase() || recipe.difficulty;
    recipe.dietary = dietary || recipe.dietary;
    recipe.sustainability = sustainability || recipe.sustainability;
    recipe.ingredients = ingredients || recipe.ingredients;

    // Handle image update
    if (req.file) {
      // Delete old image if exists
      if (recipe.imageUrl) {
        const oldImagePath = path.join(process.cwd(), recipe.imageUrl);
        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath);
        }
      }
      recipe.imageUrl = `/uploads/recipes/${req.file.filename}`;
    }

    await recipe.save();

    res.status(200).json({
      success: true,
      message: "Recipe updated successfully.",
      recipe
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error updating recipe.",
      error: error.message
    });
  }
};

/**
 * Delete a recipe
 * DELETE /api/recipes/:id
 */
export const deleteRecipe = async (req, res) => {
  try {
    const { id } = req.params;
    const recipe = await Recipe.findByPk(id);

    if (!recipe) {
      return res.status(404).json({ success: false, message: "Recipe not found." });
    }

    // Check ownership
    if (recipe.userId !== req.user.id && req.user.role !== "admin") {
      return res.status(403).json({ success: false, message: "Not authorized to delete this recipe." });
    }

    // Delete image file
    if (recipe.imageUrl) {
      const imagePath = path.join(process.cwd(), recipe.imageUrl);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }

    await recipe.destroy();

    res.status(200).json({
      success: true,
      message: "Recipe deleted successfully."
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error deleting recipe.",
      error: error.message
    });
  }
};

/**
 * Get all approved recipes (with filters)
 * GET /api/recipes
 */
export const getAllRecipes = async (req, res) => {
  try {
    const { category, dietary, sustainability, search } = req.query;
    const where = { status: "approved" };

    if (category && category !== "All") {
      const cat = await Category.findOne({ where: { name: category } });
      if (cat) where.categoryId = cat.id;
    }

    if (dietary && dietary !== "All") {
      where.dietary = dietary;
    }

    if (sustainability && sustainability !== "All") {
      where.sustainability = sustainability;
    }

    if (search) {
      where.title = { [Op.iLike]: `%${search}%` };
    }

    const recipes = await Recipe.findAll({
      where,
      include: [
        { model: Category, as: "category", attributes: ["name"] },
                { model: User, as: "author", attributes: ["name"] }
      ],
      order: [["createdAt", "DESC"]]
    });

    res.status(200).json({
      success: true,
      recipes
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching recipes.",
      error: error.message
    });
  }
};

/**
 * Get single recipe by ID
 * GET /api/recipes/:id
 */
export const getRecipeById = async (req, res) => {
  try {
    const { id } = req.params;
    const recipe = await Recipe.findByPk(id, {
      include: [
        { model: Category, as: "category", attributes: ["name"] },
                { model: User, as: "author", attributes: ["name"] }
      ]
    });

    if (!recipe) {
      return res.status(404).json({ success: false, message: "Recipe not found." });
    }

    res.status(200).json({
      success: true,
      recipe
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching recipe.",
      error: error.message
    });
  }
};

/**
 * Get all recipes for admin (all statuses)
 * GET /api/recipes/admin/all
 */
export const getAllRecipesAdmin = async (req, res) => {
  try {
    const { status } = req.query;
    const where = {};

    if (status && status !== "all") {
      where.status = status;
    }

    const recipes = await Recipe.findAll({
      where,
      include: [
        { model: Category, as: "category", attributes: ["name"] },
        { model: User, as: "author", attributes: ["id", "name", "email"] }
      ],
      order: [["createdAt", "DESC"]]
    });

    res.status(200).json({
      success: true,
      recipes
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching recipes.",
      error: error.message
    });
  }
};

/**
 * Update recipe status (admin only)
 * PUT /api/recipes/:id/status
 */
export const updateRecipeStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!["pending", "approved", "rejected"].includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status. Must be 'pending', 'approved', or 'rejected'."
      });
    }

    const recipe = await Recipe.findByPk(id);
    if (!recipe) {
      return res.status(404).json({ success: false, message: "Recipe not found." });
    }

    recipe.status = status;
    await recipe.save();

    res.status(200).json({
      success: true,
      message: `Recipe ${status}.`,
      recipe
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error updating recipe status.",
      error: error.message
    });
  }
};
