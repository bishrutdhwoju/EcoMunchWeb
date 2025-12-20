import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";
import bcrypt from "bcrypt";

const User = sequelize.define(
  "User",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
      validate: {
        notEmpty: { msg: "Name is required" },
        len: { args: [2, 100], msg: "Name must be between 2 and 100 characters" },
      },
    },
    email: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: { msg: "Email already exists" },
      validate: {
        isEmail: { msg: "Please provide a valid email" },
        notEmpty: { msg: "Email is required" },
      },
    },
    password: {
      type: DataTypes.STRING(255),
      allowNull: false,
      validate: {
        notEmpty: { msg: "Password is required" },
        len: { args: [6, 255], msg: "Password must be at least 6 characters" },
        hasUppercase(value) {
          if (!/[A-Z]/.test(value)) {
            throw new Error("Password must contain at least one uppercase letter");
          }
        },
      },
    },
    role: {
      type: DataTypes.ENUM("user", "admin"),
      defaultValue: "user",
    },
    securityQuestion: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    securityAnswer: {
      type: DataTypes.STRING(255),
      allowNull: true,
      set(value) {
        // Store answer in lowercase and trimmed for case-insensitive comparison
        this.setDataValue("securityAnswer", value ? value.toLowerCase().trim() : null);
      },
    },
    phone: {
      type: DataTypes.STRING(20),
      allowNull: true,
    },
    cookingLevel: {
      type: DataTypes.STRING(20),
      allowNull: true,
      comment: "beginner, intermediate, advanced, chef",
    },
    avatarUrl: {
      type: DataTypes.STRING(500),
      allowNull: true,
      comment: "URL path to profile picture",
    },
  },
  {
    timestamps: true,
    hooks: {
      beforeCreate: async (user) => {
        if (user.password) {
          const salt = await bcrypt.genSalt(10);
          user.password = await bcrypt.hash(user.password, salt);
        }
      },
      beforeUpdate: async (user) => {
        if (user.changed("password")) {
          const salt = await bcrypt.genSalt(10);
          user.password = await bcrypt.hash(user.password, salt);
        }
      },
    },
  }
);

// Instance method to compare password
if (User.prototype) {
  User.prototype.comparePassword = async function (candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
  };

  // Remove sensitive fields from JSON output
  User.prototype.toJSON = function () {
    const values = { ...this.get() };
    delete values.password;
    delete values.securityAnswer;
    return values;
  };
}

export default User;
