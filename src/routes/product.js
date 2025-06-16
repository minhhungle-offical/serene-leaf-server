import express from "express";
import {
  createProduct,
  deleteProduct,
  getProductById,
  getProductBySlug,
  getProducts,
  updateProduct,
} from "../controllers/productController.js";
import { checkAuth } from "../middlewares/checkAuth.js";
import { uploadImage } from "../middlewares/uploadMiddleware.js";

const router = express.Router();

router.get("/", getProducts);
router.get("/:id", getProductById);
router.get("/slug/:slug", getProductBySlug);

router.post("/", checkAuth, uploadImage, createProduct);
router.put("/:id", checkAuth, uploadImage, updateProduct);
router.delete("/:id", checkAuth, deleteProduct);

export default router;
