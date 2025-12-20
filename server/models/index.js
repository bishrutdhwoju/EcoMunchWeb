// Central file for model associations and exports
import User from "./User.js";
import Category from "./Category.js";
import Recipe from "./Recipe.js";
import Ingredient from "./Ingredient.js";
import RecipeIngredient from "./RecipeIngredient.js";
import Bookmark from "./Bookmark.js";

// =====================
// Define Associations
// =====================

// User <-> Recipe (One-to-Many)
User.hasMany(Recipe, { foreignKey: "userId", as: "recipes" });
Recipe.belongsTo(User, { foreignKey: "userId", as: "author" });

// Category <-> Recipe (One-to-Many)
Category.hasMany(Recipe, { foreignKey: "categoryId", as: "recipes" });
Recipe.belongsTo(Category, { foreignKey: "categoryId", as: "category" });

// Recipe <-> Ingredient (Many-to-Many through RecipeIngredient)
Recipe.belongsToMany(Ingredient, {
  through: RecipeIngredient,
  foreignKey: "recipeId",
  otherKey: "ingredientId",
  as: "associatedIngredients",
});
Ingredient.belongsToMany(Recipe, {
  through: RecipeIngredient,
  foreignKey: "ingredientId",
  otherKey: "recipeId",
  as: "recipes",
});

// User <-> Recipe (Many-to-Many through Bookmark)
User.belongsToMany(Recipe, {
  through: Bookmark,
  foreignKey: "userId",
  otherKey: "recipeId",
  as: "bookmarks",
});
Recipe.belongsToMany(User, {
  through: Bookmark,
  foreignKey: "recipeId",
  otherKey: "userId",
  as: "bookmarkedBy",
});

export { User, Category, Recipe, Ingredient, RecipeIngredient, Bookmark };
