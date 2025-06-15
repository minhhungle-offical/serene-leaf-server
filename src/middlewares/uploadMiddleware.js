import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../config/cloudinary.js";

// Configure Cloudinary storage for uploaded images
const imageStorage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => {
    return {
      folder: "serene-leaf", // Folder name in Cloudinary
      public_id: `${Date.now()}-${file.originalname.split(".")[0]}`, // Unique public ID using timestamp + original filename
      allowed_formats: ["jpg", "jpeg", "png"], // Restrict allowed formats
      transformation: [
        { quality: "auto:low" }, // Automatically compress image to reduce size
        { fetch_format: "auto" }, // Automatically convert to optimal format like WebP
      ],
    };
  },
});

// File filter to allow only specific image MIME types
const fileFilter = (req, file, cb) => {
  const allowedMimeTypes = ["image/jpeg", "image/png", "image/jpg"];
  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true); // Accept the file
  } else {
    cb(new Error("Only JPG, JPEG, and PNG files are allowed"), false); // Reject other file types
  }
};

// Initialize multer with Cloudinary storage and file type filter
const upload = multer({
  storage: imageStorage,
  fileFilter,
});

// Middleware for uploading a single image (field name: 'image')
export const uploadImage = upload.single("image");

// Middleware for uploading up to 5 images (field name: 'images')
export const uploadMultipleImages = upload.array("images", 5);

export default upload;
