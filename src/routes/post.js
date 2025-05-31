import express from "express";
import {
  createPost,
  deletePost,
  getPostById,
  getPostBySlug,
  getPosts,
  updatePost,
} from "../controllers/postController.js";
import { checkAuth } from "../middlewares/checkAuth.js";
import upload from "../middlewares/uploadMiddleware.js"; // middleware upload ảnh (Multer)

const router = express.Router();

router.get("/", getPosts);
router.get("/id/:id", getPostById);
router.get("/slug/:slug", getPostBySlug);

router.use(checkAuth);
router.post("/", upload.single("image"), createPost);
router.put("/:id", upload.single("image"), updatePost);
router.delete("/:id", deletePost);

export default router;
