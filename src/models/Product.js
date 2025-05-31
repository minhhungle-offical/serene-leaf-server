import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    shortDescription: {
      type: String,
      required: true,
    },

    description: {
      type: String,
    },

    price: {
      type: Number,
      required: true,
      min: 0,
    },

    category: {
      type: String,
      trim: true,
    },

    quantity: {
      type: Number,
      required: true,
      min: 0,
      default: 0,
    },

    slug: { type: String, required: true, unique: true },

    image: {
      url: { type: String, default: "" },
      publicId: { type: String, default: "" },
    },

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
