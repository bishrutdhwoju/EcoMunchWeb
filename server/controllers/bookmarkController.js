import { Bookmark, Recipe, Category, User } from "../models/index.js";

/**
 * Get all bookmarks for the authenticated user
 * GET /api/bookmarks
 */
export const getMyBookmarks = async (req, res) => {
  try {
    const bookmarkedRecipes = await Recipe.findAll({
      include: [
        { model: Category, as: "category", attributes: ["id", "name"] },
        { model: User, as: "author", attributes: ["id", "name"] },
        {
          model: User,
          as: "bookmarkedBy",
          where: { id: req.user.id },
          attributes: [],
          through: { attributes: ["createdAt"] },
        },
      ],
      order: [["createdAt", "DESC"]],
    });

    res.status(200).json({
      success: true,
      bookmarks: bookmarkedRecipes,
    });
  } catch (error) {
    console.error("Error fetching bookmarks:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching bookmarks.",
      error: error.message,
    });
  }
};

/**
 * Add a bookmark
 * POST /api/bookmarks/:recipeId
 */
export const addBookmark = async (req, res) => {
  try {
    const { recipeId } = req.params;

    // Check if recipe exists
    const recipe = await Recipe.findByPk(recipeId);
    if (!recipe) {
      return res.status(404).json({
        success: false,
        message: "Recipe not found.",
      });
    }

    // Check if already bookmarked
    const existing = await Bookmark.findOne({
      where: { userId: req.user.id, recipeId },
    });

    if (existing) {
      return res.status(400).json({
        success: false,
        message: "Recipe already bookmarked.",
      });
    }

    await Bookmark.create({
      userId: req.user.id,
      recipeId: parseInt(recipeId),
    });

    res.status(201).json({
      success: true,
      message: "Recipe bookmarked successfully.",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error adding bookmark.",
      error: error.message,
    });
  }
};

/**
 * Remove a bookmark
 * DELETE /api/bookmarks/:recipeId
 */
export const removeBookmark = async (req, res) => {
  try {
    const { recipeId } = req.params;

    const bookmark = await Bookmark.findOne({
      where: { userId: req.user.id, recipeId },
    });

    if (!bookmark) {
      return res.status(404).json({
        success: false,
        message: "Bookmark not found.",
      });
    }

    await bookmark.destroy();

    res.status(200).json({
      success: true,
      message: "Bookmark removed successfully.",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error removing bookmark.",
      error: error.message,
    });
  }
};

/**
 * Check if a recipe is bookmarked by the current user
 * GET /api/bookmarks/check/:recipeId
 */
export const checkBookmark = async (req, res) => {
  try {
    const { recipeId } = req.params;

    const bookmark = await Bookmark.findOne({
      where: { userId: req.user.id, recipeId },
    });

    res.status(200).json({
      success: true,
      isBookmarked: !!bookmark,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error checking bookmark.",
      error: error.message,
    });
  }
};
