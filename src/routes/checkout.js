import express from "express";
import { checkout } from "../controllers/checkoutController.js";
import { checkAuth } from "../middlewares/checkAuth.js";

const router = express.Router();

// 👉 Thanh toán giỏ hàng
router.post("/", checkAuth, checkout);

export default router;
