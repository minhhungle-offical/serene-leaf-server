import express from "express";
import {
  uploadMultipleImages as handleMultipleUpload,
  removeImage,
  uploadSingleImage,
} from "../controllers/uploadController.js";
import { checkAuth } from "../middlewares/checkAuth.js";
import {
  uploadImage,
  uploadMultipleImages,
} from "../middlewares/uploadMiddleware.js";

const router = express.Router();

router.use(checkAuth);

// Single image upload
router.post("/single-image", uploadImage, uploadSingleImage);

// Multiple images upload (up to 5)
router.post("/multiple-images", uploadMultipleImages, handleMultipleUpload);

// Remove image from Cloudinary (requires auth)
router.post("/remove-image", removeImage);

export default router;
