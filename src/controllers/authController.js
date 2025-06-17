import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import Otp from "../models/Otp.js";
import { generateOTP } from "../utils/generateOTP.js";
import { sendOtpEmail } from "../utils/sendOtpEmail.js";

// Generate JWT token
const generateToken = (user) => {
  return jwt.sign(
    { id: user._id, email: user.email, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "1d" }
  );
};

// Generate and send OTP to email
const sendOtp = async (email) => {
  const otpCode = generateOTP();
  await Otp.findOneAndUpdate(
    { email },
    {
      code: otpCode,
      expireAt: new Date(Date.now() + 10 * 60 * 1000),
    },
    { upsert: true, new: true }
  );
  sendOtpEmail(email, otpCode);
};

// Register user
export const signup = async (req, res, next) => {
  try {
    const { email, password, role, name, address, phoneNumber } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields: email, password",
      });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "Email already registered",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      role: role || "customer",
      address,
      phoneNumber,
    });

    await newUser.save();
    await sendOtp(email);

    res.status(201).json({
      success: true,
      message: "User created successfully. OTP sent to email.",
      data: {
        id: newUser._id,
        email: newUser.email,
        role: newUser.role,
      },
    });
  } catch (error) {
    next(error);
  }
};

// Login user
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password)
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });

    const user = await User.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid credentials" });
    }

    const token = generateToken(user);

    res.status(200).json({
      success: true,
      message: "Login successful",
      data: {
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

// Change password
export const changePassword = async (req, res, next) => {
  try {
    const userId = req.user?.id;
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields: currentPassword, newPassword",
      });
    }

    const user = await User.findById(userId);
    if (!user)
      return res.status(404).json({
        success: false,
        message: "User not found",
      });

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Current password is incorrect",
      });
    }

    user.password = await bcrypt.hash(newPassword, 12);
    await user.save();

    res.status(200).json({
      success: true,
      message: "Password changed successfully",
    });
  } catch (error) {
    next(error);
  }
};

// Send OTP (shared for register, reset password, etc.)
export const requestOtp = async (req, res, next) => {
  try {
    const { email } = req.body;

    if (!email)
      return res.status(400).json({
        success: false,
        message: "Email is required",
      });

    const user = await User.findOne({ email });
    if (!user)
      return res.status(404).json({
        success: false,
        message: "User not found",
      });

    await sendOtp(email);

    res.status(200).json({
      success: true,
      message: "OTP sent successfully",
    });
  } catch (error) {
    next(error);
  }
};

// Verify OTP
export const verifyOtp = async (req, res, next) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp)
      return res.status(400).json({
        success: false,
        message: "Email and OTP are required",
      });

    const otpRecord = await Otp.findOne({ email, code: otp });

    if (!otpRecord)
      return res.status(400).json({
        success: false,
        message: "Invalid OTP",
      });

    if (otpRecord.expireAt < new Date())
      return res.status(400).json({
        success: false,
        message: "OTP expired",
      });

    res.status(200).json({
      success: true,
      message: "OTP verified successfully",
    });
  } catch (error) {
    next(error);
  }
};

// Reset password after OTP verification
export const finalizeResetPassword = async (req, res, next) => {
  try {
    const { email, otp, newPassword } = req.body;

    if (!email || !otp || !newPassword)
      return res.status(400).json({
        success: false,
        message: "Missing required fields",
      });

    const otpRecord = await Otp.findOne({ email, code: otp });

    if (!otpRecord || otpRecord.expireAt < new Date())
      return res.status(400).json({
        success: false,
        message: "Invalid or expired OTP",
      });

    const user = await User.findOne({ email });
    if (!user)
      return res.status(404).json({
        success: false,
        message: "User not found",
      });

    user.password = await bcrypt.hash(newPassword, 12);
    await user.save();

    await Otp.deleteOne({ email, code: otp });

    res.status(200).json({
      success: true,
      message: "Password reset successfully",
    });
  } catch (error) {
    next(error);
  }
};

// Get current profile
export const getProfile = async (req, res, next) => {
  try {
    const userId = req.user?.id;

    if (!userId)
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });

    const user = await User.findById(userId).select("-password").lean();

    if (!user)
      return res.status(404).json({
        success: false,
        message: "User not found",
      });

    res.status(200).json({
      success: true,
      message: "User profile retrieved successfully",
      data: user,
    });
  } catch (error) {
    next(error);
  }
};
