import express from "express";
import {
  deleteUser,
  getAllUsers,
  getUserById,
  updateUser,
} from "../controllers/userController.js";
import { checkAuth } from "../middlewares/checkAuth.js";

const router = express.Router();

// Routes for logged-in users
router.use(checkAuth); // All routes below require login

// GET /users - get all users with optional pagination and filters
router.get("/", getAllUsers);

// GET /users/:id - get user by ID
router.get("/:id", getUserById);

// PUT /users/:id - update user info (except password)
router.put("/:id", updateUser);

// DELETE /users/:id - delete user
router.delete("/:id", deleteUser);

export default router;
