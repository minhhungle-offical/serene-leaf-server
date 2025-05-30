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

// Route user sign-up
router.post("/signup", signup);

// Route user login
router.post("/login", login);

// Route change password (you can add auth middleware here later)
router.post("/change-password", changePassword);

// Request OTP for password reset
router.post("/reset-password/request", requestResetPassword);

// Verify OTP for password reset
router.post("/reset-password/verify-otp", verifyOtp);

// Finalize password reset after OTP verification
router.post("/reset-password/finalize", finalizeResetPassword);

// Resend OTP for password reset
router.post("/reset-password/resend-otp", resendOtp);

// Route get current user profile
router.get("/profile", getProfile);

export default router;
