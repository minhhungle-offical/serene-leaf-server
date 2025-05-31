import express from "express";
import {
  createCategory,
  getAllCategories,
  getCategoryBySlug,
  updateCategory,
  deleteCategory,
} from "../controllers/postCategoryController.js";
import { checkAuth } from "../middlewares/checkAuth.js";

const router = express.Router();

router.get("/", getAllCategories);
router.get("/:slug", getCategoryBySlug);

router.use(checkAuth);
router.post("/", createCategory);
router.put("/:slug", updateCategory);
router.delete("/:slug", deleteCategory);

export default router;
