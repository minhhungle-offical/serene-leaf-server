import express from "express";
import {
  createCategory,
  getAllCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
} from "../controllers/categoryController.js";
import { checkAuth } from "../middlewares/checkAuth.js";

const router = express.Router();

// GET /api/categories - Get all categories
router.get("/", getAllCategories);

// GET /api/categories/:id - Get a single category by ID
router.get("/:id", getCategoryById);

// Routes for logged-in users
router.use(checkAuth); // All routes below require login

// POST /api/categories - Create a new category
router.post("/", createCategory);

// PUT /api/categories/:id - Update a category
router.put("/:id", updateCategory);

// DELETE /api/categories/:id - Delete a category
router.delete("/:id", deleteCategory);

export default router;
