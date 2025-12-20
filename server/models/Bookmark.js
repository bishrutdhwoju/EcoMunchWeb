import { sequelize } from "../config/db.js";
import { DataTypes } from "sequelize";

const Bookmark = sequelize.define(
  "Bookmark",
  {
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    recipeId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    timestamps: true,
  }
);

export default Bookmark;
