import jwt from "jsonwebtoken";
import { User } from "../models/index.js";
import fs from "fs";
import path from "path";

/**
 * Generate JWT token
 */
const generateToken = (user) => {
  return jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || "7d" }
  );
};

/**
 * Set JWT token in HTTP-only cookie
 */
const sendTokenCookie = (res, token) => {
  const isProduction = process.env.NODE_ENV === "production";
  
  res.cookie("token", token, {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? "strict" : "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });
};

/**
 * Register a new user
 * POST /api/auth/register
 */
export const register = async (req, res) => {
  try {
    const { name, email, password, securityQuestion, securityAnswer, phone, cookingLevel } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User with this email already exists.",
      });
    }

    // Create new user with security question
    const user = await User.create({
      name,
      email,
      password,
      securityQuestion: securityQuestion || null,
      securityAnswer: securityAnswer || null,
      phone: phone || null,
      cookingLevel: cookingLevel || null,
    });

    // Generate token and set cookie
    const token = generateToken(user);
    sendTokenCookie(res, token);

    res.status(201).json({
      success: true,
      message: "Registration successful.",
      user: user.toJSON(),
    });
  } catch (error) {
    // Handle Sequelize validation errors
    if (error.name === "SequelizeValidationError") {
      const messages = error.errors.map((e) => e.message);
      return res.status(400).json({
        success: false,
        message: messages.join(", "),
      });
    }
    res.status(500).json({
      success: false,
      message: "Server error during registration.",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

/**
 * Login user
 * POST /api/auth/login
 */
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required.",
      });
    }

    // Find user by email
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password.",
      });
    }

    // Compare password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password.",
      });
    }

    // Generate token and set cookie
    const token = generateToken(user);
    sendTokenCookie(res, token);

    res.status(200).json({
      success: true,
      message: "Login successful.",
      user: user.toJSON(),
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error during login.",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

/**
 * Logout user
 * POST /api/auth/logout
 */
export const logout = (req, res) => {
  res.cookie("token", "", {
    httpOnly: true,
    expires: new Date(0),
  });

  res.status(200).json({
    success: true,
    message: "Logged out successfully.",
  });
};

/**
 * Get current authenticated user
 * GET /api/auth/me
 */
export const getMe = async (req, res) => {
  try {
    // User is already attached by verifyToken middleware
    res.status(200).json({
      success: true,
      user: req.user.toJSON(),
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error fetching user.",
    });
  }
};

/**
 * Update current user's profile
 * PUT /api/auth/profile
 */
export const updateProfile = async (req, res) => {
  try {
    const { name, email, phone, cookingLevel } = req.body;
    const user = await User.findByPk(req.user.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    // Check if email is being changed and if new email is already taken
    if (email && email !== user.email) {
      const existingUser = await User.findOne({ where: { email } });
      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: "Email is already in use by another account.",
        });
      }
    }

    // Update fields
    if (name) user.name = name;
    if (email) user.email = email;
    if (phone !== undefined) user.phone = phone;
    if (cookingLevel !== undefined) user.cookingLevel = cookingLevel;

    // Handle avatar upload
    if (req.file) {
      // Delete old avatar if exists
      if (user.avatarUrl) {
        const oldAvatarPath = path.join(process.cwd(), user.avatarUrl);
        if (fs.existsSync(oldAvatarPath)) {
          fs.unlinkSync(oldAvatarPath);
        }
      }
      user.avatarUrl = `/uploads/avatars/${req.file.filename}`;
    }

    await user.save();

    res.status(200).json({
      success: true,
      message: "Profile updated successfully.",
      user: user.toJSON(),
    });
  } catch (error) {
    if (error.name === "SequelizeValidationError") {
      const messages = error.errors.map((e) => e.message);
      return res.status(400).json({
        success: false,
        message: messages.join(", "),
      });
    }
    res.status(500).json({
      success: false,
      message: "Error updating profile.",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

/**
 * Get security question for a user by email
 * POST /api/auth/forgot-password/question
 */
export const getSecurityQuestion = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required.",
      });
    }

    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "No account found with this email.",
      });
    }

    if (!user.securityQuestion) {
      return res.status(400).json({
        success: false,
        message: "No security question set for this account. Please contact support.",
      });
    }

    res.status(200).json({
      success: true,
      securityQuestion: user.securityQuestion,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error.",
    });
  }
};

/**
 * Verify security answer
 * POST /api/auth/forgot-password/verify
 */
export const verifySecurityAnswer = async (req, res) => {
  try {
    const { email, securityAnswer } = req.body;

    if (!email || !securityAnswer) {
      return res.status(400).json({
        success: false,
        message: "Email and security answer are required.",
      });
    }

    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "No account found with this email.",
      });
    }

    // Compare answers (case-insensitive, trimmed)
    const isCorrect = user.securityAnswer === securityAnswer.toLowerCase().trim();

    if (!isCorrect) {
      return res.status(400).json({
        success: false,
        message: "Incorrect security answer. Please try again.",
      });
    }

    // Generate a short-lived token for password reset (5 minutes)
    const resetToken = jwt.sign(
      { id: user.id, purpose: "password-reset" },
      process.env.JWT_SECRET,
      { expiresIn: "5m" }
    );

    res.status(200).json({
      success: true,
      message: "Security answer verified.",
      resetToken,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error.",
    });
  }
};

/**
 * Reset password using reset token
 * POST /api/auth/forgot-password/reset
 */
export const resetPassword = async (req, res) => {
  try {
    const { resetToken, newPassword } = req.body;

    if (!resetToken || !newPassword) {
      return res.status(400).json({
        success: false,
        message: "Reset token and new password are required.",
      });
    }

    // Verify reset token
    let decoded;
    try {
      decoded = jwt.verify(resetToken, process.env.JWT_SECRET);
    } catch (err) {
      return res.status(400).json({
        success: false,
        message: "Reset link has expired. Please start the process again.",
      });
    }

    if (decoded.purpose !== "password-reset") {
      return res.status(400).json({
        success: false,
        message: "Invalid reset token.",
      });
    }

    const user = await User.findByPk(decoded.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    // Update password (beforeUpdate hook will hash it)
    user.password = newPassword;
    await user.save();

    res.status(200).json({
      success: true,
      message: "Password reset successfully. You can now login with your new password.",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error during password reset.",
    });
  }
};

/**
 * Change password (requires current password)
 * PUT /api/auth/change-password
 */
export const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: "Current password and new password are required.",
      });
    }

    const user = await User.findByPk(req.user.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    // Verify current password
    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Current password is incorrect.",
      });
    }

    // Update password (hook will hash it)
    user.password = newPassword;
    await user.save();

    res.status(200).json({
      success: true,
      message: "Password changed successfully.",
    });
  } catch (error) {
    if (error.name === "SequelizeValidationError") {
      const messages = error.errors.map((e) => e.message);
      return res.status(400).json({
        success: false,
        message: messages.join(", "),
      });
    }
    res.status(500).json({
      success: false,
      message: "Error changing password.",
    });
  }
};
