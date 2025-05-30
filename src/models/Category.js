import mongoose from "mongoose";

const categorySchema = new mongoose.Schema(
  {
    // Name of the category, required, unique, trimmed
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    // Optional description for the category
    description: {
      type: String,
      trim: true,
    },

    // Whether this category is active or not
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    // Automatically add createdAt and updatedAt fields
    timestamps: true,
    versionKey: false, // disable __v field
  }
);

const Category = mongoose.model("Category", categorySchema);

export default Category;
