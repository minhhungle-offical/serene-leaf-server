import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../config/cloudinary.js";

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "serene-leaf",
    allowed_formats: ["jpg", "jpeg", "png"],
    transformation: [{ width: 800, height: 800, crop: "limit" }],
  },
});

const uploadMiddleware = multer({ storage });
export const uploadMultipleImages = uploadMiddleware.array("images", 5);
export const uploadImage = uploadMiddleware.single("image");

export default uploadMiddleware;
