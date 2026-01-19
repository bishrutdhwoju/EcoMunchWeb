import { Category, Recipe } from "../models/index.js";

/**
 * Get all categories
 * GET /api/categories
 */
export const getAllCategories = async (req, res) => {
  try {
    const categories = await Category.findAll({
      order: [["name", "ASC"]],
    });

    // Get recipe count for each category
    const categoriesWithCount = await Promise.all(
      categories.map(async (cat) => {
        const recipeCount = await Recipe.count({ where: { categoryId: cat.id } });
        return {
          ...cat.toJSON(),
          recipeCount,
        };
      })
    );

    res.status(200).json({
      success: true,
      categories: categoriesWithCount,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching categories.",
      error: error.message,
    });
  }
};

/**
 * Create category (admin only)
 * POST /api/categories
 */
export const createCategory = async (req, res) => {
  try {
    const { name, description } = req.body;

    if (!name) {
      return res.status(400).json({
        success: false,
        message: "Category name is required.",
      });
    }

    const existing = await Category.findOne({ where: { name } });
    if (existing) {
      return res.status(400).json({
        success: false,
        message: "Category already exists.",
      });
    }

    const category = await Category.create({ name, description });

    res.status(201).json({
      success: true,
      message: "Category created.",
      category,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error creating category.",
      error: error.message,
    });
  }
};

/**
 * Update category (admin only)
 * PUT /api/categories/:id
 */
export const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description } = req.body;

    const category = await Category.findByPk(id);
    if (!category) {
      return res.status(404).json({ success: false, message: "Category not found." });
    }

    if (name) category.name = name;
    if (description !== undefined) category.description = description;
    await category.save();

    res.status(200).json({
      success: true,
      message: "Category updated.",
      category,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error updating category.",
      error: error.message,
    });
  }
};

/**
 * Delete category (admin only)
 * DELETE /api/categories/:id
 */
export const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;

    const category = await Category.findByPk(id);
    if (!category) {
      return res.status(404).json({ success: false, message: "Category not found." });
    }

    await category.destroy();

    res.status(200).json({
      success: true,
      message: "Category deleted.",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error deleting category.",
      error: error.message,
    });
  }
};
