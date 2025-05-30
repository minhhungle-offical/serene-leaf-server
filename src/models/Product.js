import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    // Product name, required, trimmed, max length 100
    name: {
      type: String,
      required: true,
      trim: true,
    },
    // Short description,required, optional, trimmed, max length 300
    shortDescription: {
      type: String,
      required: true,
    },

    // Product description, optional, trimmed, max length 500
    description: {
      type: String,
    },

    // Product price, required, minimum 0
    price: {
      type: Number,
      required: true,
      min: 0,
    },

    // Product category, optional, trimmed, max length 50
    category: {
      type: String,
      trim: true,
      maxlength: 50,
    },

    // Stock quantity, required, minimum 0, default to 0
    quantity: {
      type: Number,
      required: true,
      min: 0,
      default: 0,
    },

    // Single product image stored as an object with url and publicId from Cloudinary
    image: {
      url: { type: String, default: "" },
      publicId: { type: String, default: "" },
    },

    // Flag to indicate if the product is active/available for sale
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    // Automatically add createdAt and updatedAt timestamps
    timestamps: true,
    // Disable the __v version key
    versionKey: false,
  }
);

const Product = mongoose.model("Product", productSchema);

export default Product;
