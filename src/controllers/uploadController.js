import { v2 as cloudinary } from "cloudinary";

export const uploadSingleImage = (req, res) => {
  if (!req.file) {
    return res.status(400).json({
      message: "No file uploaded",
      data: null,
    });
  }

  return res.status(200).json({
    message: "Image uploaded successfully",
    data: {
      url: req.file.path,
      publicId: req.file.filename,
    },
  });
};

export const uploadMultipleImages = (req, res) => {
  if (!req.files || req.files.length === 0) {
    return res.status(400).json({
      message: "No files uploaded",
      data: null,
    });
  }

  const images = req.files.map((file) => ({
    url: file.path,
    publicId: file.filename,
  }));

  return res.status(200).json({
    message: "Images uploaded successfully",
    data: images,
  });
};

export const removeImage = async (req, res) => {
  const { publicId } = req.body;

  if (!publicId) {
    return res.status(400).json({
      message: "publicId is required",
      data: null,
    });
  }

  try {
    const result = await cloudinary.uploader.destroy(publicId);

    if (result.result !== "ok") {
      return res.status(400).json({
        message: "Failed to delete image",
        data: null,
      });
    }

    return res.status(200).json({
      message: "Image deleted successfully",
      data: { publicId },
    });
  } catch (error) {
    return res.status(500).json({
      message: "Server error while deleting image",
      data: { error: error.message },
    });
  }
};
