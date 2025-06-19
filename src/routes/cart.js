import express from "express";
import {
  getCart,
  addToCart,
  removeFromCart,
  clearCart,
  updateCartItemQuantity,
} from "../controllers/cartController.js";
import { checkAuth } from "../middlewares/checkAuth.js";

const router = express.Router();

// 👉 Get current user's cart
router.get("/", checkAuth, getCart);

// 👉 Add or update an item in the cart
router.post("/", checkAuth, addToCart);

router.put("/update-quantity/:productId", checkAuth, updateCartItemQuantity);

// 👉 Remove a specific product from the cart
router.delete("/:productId", checkAuth, removeFromCart);

// 👉 Clear the entire cart
router.delete("/", checkAuth, clearCart);

export default router;
