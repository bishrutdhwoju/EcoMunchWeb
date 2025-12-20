import jwt from "jsonwebtoken";
import { User } from "../models/index.js";

/**
 * Middleware to verify JWT token from cookies
 * Attaches user to req.user if valid
 */
export const verifyToken = async (req, res, next) => {
  try {
    // Get token from cookie
    const token = req.cookies?.token;

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Access denied. No token provided.",
      });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Find user by id from token
    const user = await User.findByPk(decoded.id);

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User not found. Token is invalid.",
      });
    }

    // Attach user to request object
    req.user = user;
    next();
  } catch (error) {
    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({
        success: false,
        message: "Invalid token.",
      });
    }
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        success: false,
        message: "Token has expired.",
      });
    }
    return res.status(500).json({
      success: false,
      message: "Server error during authentication.",
    });
  }
};

/**
 * Middleware to check if user is admin
 * Must be used after verifyToken middleware
 */
export const requireAdmin = (req, res, next) => {
  if (req.user?.role !== "admin") {
    return res.status(403).json({
      success: false,
      message: "Access denied. Admin privileges required.",
    });
  }
  next();
};

// Alias for requireAdmin
export const isAdmin = requireAdmin;

/**
 * Optional auth - attaches user if token exists, but doesn't block
 */
export const optionalAuth = async (req, res, next) => {
  try {
    const token = req.cookies?.token;

    if (token) {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findByPk(decoded.id);
      if (user) {
        req.user = user;
      }
    }
    next();
  } catch (error) {
    // Token invalid or expired, continue without user
    next();
  }
};
