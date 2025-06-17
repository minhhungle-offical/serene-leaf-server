import express from "express";
import {
  getCart,
  addToCart,
  removeFromCart,
  clearCart,
} from "../controllers/cartController.js";
import { checkAuth } from "../middlewares/checkAuth.js";

const router = express.Router();

// 👉 Lấy giỏ hàng
router.get("/", checkAuth, getCart);

// 👉 Thêm/cập nhật món trong giỏ
router.post("/", checkAuth, addToCart);

// 👉 Xoá 1 sản phẩm khỏi giỏ
router.delete("/:productId", checkAuth, removeFromCart);

// 👉 Xoá toàn bộ giỏ
router.delete("/", checkAuth, clearCart);

export default router;
