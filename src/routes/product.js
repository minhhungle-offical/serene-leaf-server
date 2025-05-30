import express from "express";
import {
  createProduct,
  deleteProduct,
  getProductById,
  getProducts,
  updateProduct,
} from "../controllers/productController.js";
import { checkAuth } from "../middlewares/checkAuth.js";
import { uploadImage } from "../middlewares/uploadMiddleware.js";

const router = express.Router();

// Routes for logged-in users
router.use(checkAuth); // All routes below require login

// POST /api/products - Create new product
router.post("/", uploadImage, createProduct);

// GET /api/products - Get all products with filters
router.get("/", getProducts);

// GET /api/products/:id - Get single product by ID
router.get("/:id", getProductById);

// PUT /api/products/:id - Update a product
router.put("/:id", uploadImage, updateProduct);

// DELETE /api/products/:id - Delete a product (and image if needed)
router.delete("/:id", deleteProduct);

export default router;
