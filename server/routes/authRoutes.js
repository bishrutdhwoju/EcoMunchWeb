import express from "express";
import {
  register,
  login,
  logout,
  getMe,
  updateProfile,
  getSecurityQuestion,
  verifySecurityAnswer,
  resetPassword,
  changePassword,
} from "../controllers/authController.js";
import { verifyToken } from "../middlewares/authMiddleware.js";
import { uploadAvatar } from "../middlewares/uploadMiddleware.js";

const router = express.Router();

// Public routes
router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);

// Forgot password routes (public)
router.post("/forgot-password/question", getSecurityQuestion);
router.post("/forgot-password/verify", verifySecurityAnswer);
router.post("/forgot-password/reset", resetPassword);

// Protected routes
router.get("/me", verifyToken, getMe);
router.put("/profile", verifyToken, uploadAvatar.single("avatar"), updateProfile);
router.put("/change-password", verifyToken, changePassword);

export default router;
