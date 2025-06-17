import express from "express";
import {
  changePassword,
  finalizeResetPassword,
  getProfile,
  login,
  requestOtp,
  signup,
  verifyOtp,
} from "../controllers/authController.js";
import { checkAuth } from "../middlewares/checkAuth.js";

const router = express.Router();

router.post("/register", signup);
router.post("/login", login);
router.post("/change-password", checkAuth, changePassword);
router.post("/send-otp", requestOtp); //
router.post("/verify-otp", verifyOtp);
router.post("/reset-password", finalizeResetPassword);
router.get("/me", checkAuth, getProfile);

export default router;
