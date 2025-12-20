import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";

const RecipeIngredient = sequelize.define(
  "RecipeIngredient",
  {
    quantity: {
      type: DataTypes.STRING(100),
      allowNull: false,
      validate: {
        notEmpty: { msg: "Quantity is required" },
      },
      comment: "e.g., '2 cups', '1 tablespoon', '500g'",
    },
  },
  {
    timestamps: false,
  }
);

export default RecipeIngredient;
