import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";

const Ingredient = sequelize.define(
  "Ingredient",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: { msg: "Ingredient already exists" },
      validate: {
        notEmpty: { msg: "Ingredient name is required" },
        len: { args: [2, 100], msg: "Ingredient name must be between 2 and 100 characters" },
      },
    },
    category: {
      type: DataTypes.STRING(50),
      allowNull: true,
      defaultValue: "Other",
    },
  },
  {
    timestamps: true,
  }
);

export default Ingredient;
