import express from "express";
import {
  getMyBookmarks,
  addBookmark,
  removeBookmark,
  checkBookmark,
} from "../controllers/bookmarkController.js";
import { verifyToken } from "../middlewares/authMiddleware.js";

const router = express.Router();

// All bookmark routes require authentication
router.use(verifyToken);

router.get("/", getMyBookmarks);
router.get("/check/:recipeId", checkBookmark);
router.post("/:recipeId", addBookmark);
router.delete("/:recipeId", removeBookmark);

export default router;
