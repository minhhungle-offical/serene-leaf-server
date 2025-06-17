import express from "express";
import {
  getAllOrders,
  getOrderById,
  updateOrderStatus,
  deleteOrder,
} from "../controllers/orderController.js";
import { checkAuth } from "../middlewares/checkAuth.js";

const router = express.Router();

// 👉 Lấy tất cả đơn hàng (user hoặc admin)
router.get("/", checkAuth, getAllOrders);

// 👉 Lấy chi tiết 1 đơn hàng
router.get("/:id", checkAuth, getOrderById);

// 👉 Cập nhật trạng thái đơn hàng (admin)
router.patch("/:id", checkAuth, updateOrderStatus);

// 👉 Xoá đơn hàng
router.delete("/:id", checkAuth, deleteOrder);

export default router;
