import { generateUniqueSlug } from "../helper/slugHelper.js";
import PostCategory from "../models/PostCategory.js";

// Create new category
export const createCategory = async (req, res, next) => {
  try {
    const { name, description } = req.body;

    if (!name) {
      return res.status(400).json({
        success: false,
        message: "Name is required",
      });
    }

    const slug = await generateUniqueSlug(name);

    const exists = await PostCategory.findOne({ slug });
    if (exists) {
      return res.status(400).json({
        success: false,
        message: "Category already exists",
      });
    }

    const newCategory = new PostCategory({ name, slug, description });
    await newCategory.save();

    res.status(201).json({
      success: true,
      message: "Category created successfully",
      data: newCategory,
    });
  } catch (err) {
    next(err);
  }
};

// Get all categories
export const getAllCategories = async (req, res, next) => {
  try {
    const categories = await PostCategory.find().sort({ createdAt: -1 });

    res.json({
      success: true,
      message: "Categories fetched successfully",
      data: categories,
    });
  } catch (err) {
    next(err);
  }
};

// Get category by slug
export const getCategoryBySlug = async (req, res, next) => {
  try {
    const category = await PostCategory.findOne({ slug: req.params.slug });

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    res.json({
      success: true,
      message: "Category fetched successfully",
      data: category,
    });
  } catch (err) {
    next(err);
  }
};

// Update category by slug
export const updateCategory = async (req, res, next) => {
  try {
    const { name, description } = req.body;

    if (!name) {
      return res.status(400).json({
        success: false,
        message: "Name is required",
      });
    }

    const category = await PostCategory.findOne({ slug: req.params.slug });
    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    let newSlug = category.slug;
    if (name !== category.name) {
      newSlug = await generateUniqueSlug(name, category._id);
    }

    category.name = name;
    category.slug = newSlug;
    category.description = description;

    await category.save();

    res.json({
      success: true,
      message: "Category updated successfully",
      data: category,
    });
  } catch (err) {
    next(err);
  }
};

// Delete category by slug
export const deleteCategory = async (req, res, next) => {
  try {
    const deleted = await PostCategory.findOneAndDelete({
      slug: req.params.slug,
    });

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    res.json({
      success: true,
      message: "Category deleted successfully",
    });
  } catch (err) {
    next(err);
  }
};
