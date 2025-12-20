import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";

const Recipe = sequelize.define(
  "Recipe",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    title: {
      type: DataTypes.STRING(255),
      allowNull: false,
      validate: {
        notEmpty: { msg: "Recipe title is required" },
        len: { args: [3, 255], msg: "Title must be between 3 and 255 characters" },
      },
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    instructions: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        notEmpty: { msg: "Instructions are required" },
      },
    },
    ingredients: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: "List of ingredients",
    },
    nutrition: {
      type: DataTypes.JSONB,
      allowNull: true,
      defaultValue: {},
      comment: "Stores: calories, protein, carbs, fat, fiber, etc.",
    },
    imageUrl: {
      type: DataTypes.STRING(500),
      allowNull: true,
    },
    prepTime: {
      type: DataTypes.INTEGER,
      allowNull: true,
      comment: "Preparation time in minutes",
    },
    cookingTime: {
      type: DataTypes.INTEGER,
      allowNull: true,
      comment: "Cooking time in minutes",
    },
    servings: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 1,
    },
    difficulty: {
      type: DataTypes.ENUM("easy", "medium", "hard"),
      defaultValue: "medium",
    },
    dietary: {
      type: DataTypes.STRING(50),
      allowNull: true,
      comment: "Veg, Non-Veg, Vegan, etc.",
    },
    sustainability: {
      type: DataTypes.STRING(100),
      allowNull: true,
      comment: "Seasonal, Zero-Waste, Local, etc.",
    },
    status: {
      type: DataTypes.ENUM("pending", "approved", "rejected"),
      defaultValue: "approved",
    },
  },
  {
    timestamps: true,
  }
);

export default Recipe;
