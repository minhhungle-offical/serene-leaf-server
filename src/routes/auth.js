import express from "express";
import {
  signup,
  login,
  changePassword,
  requestResetPassword,
  verifyOtp,
  finalizeResetPassword,
  resendOtp,
  getProfile,
} from "../controllers/authController.js";

const router = express.Router();

router.post("/register", signup);
router.post("/login", login);
router.post("/change-password", changePassword);
router.post("/reset-password/request", requestResetPassword);
router.post("/reset-password/verify-otp", verifyOtp);
router.post("/reset-password/finalize", finalizeResetPassword);
router.post("/reset-password/resend-otp", resendOtp);
router.get("/profile", getProfile);

export default router;
