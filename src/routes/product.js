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

router.use(checkAuth);
router.post("/", uploadImage, createProduct);
router.put("/:id", uploadImage, updateProduct);
router.delete("/:id", deleteProduct);

export default router;
