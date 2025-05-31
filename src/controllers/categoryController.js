import { generateUniqueSlug } from "../helper/slugHelper.js";
import Category from "../models/Category.js";

// Create category with unique slug
export const createCategory = async (req, res, next) => {
  try {
    const { name, description } = req.body;
    if (!name)
      return res.status(400).json({ success: false, message: "Name required" });

    // Check name duplication
    const exists = await Category.findOne({ name });
    if (exists)
      return res
        .status(409)
        .json({ success: false, message: "Category exists" });

    const slug = await generateUniqueSlug(name);

    const category = new Category({ name, description, slug });
    await category.save();

    res
      .status(201)
      .json({ success: true, message: "Category created", data: category });
  } catch (error) {
    next(error);
  }
};

// Get all categories
export const getAllCategories = async (req, res, next) => {
  try {
    const categories = await Category.find().sort({ createdAt: -1 }).lean();
    res.json({
      success: true,
      message: "Categories fetched",
      data: categories,
    });
  } catch (error) {
    next(error);
  }
};

// Get category by ID
export const getCategoryById = async (req, res, next) => {
  try {
    const category = await Category.findById(req.params.id).lean();
    if (!category)
      return res
        .status(404)
        .json({ success: false, message: "Category not found" });
    res.json({ success: true, message: "Category fetched", data: category });
  } catch (error) {
    next(error);
  }
};

// Update category with unique slug if name changes
export const updateCategory = async (req, res, next) => {
  try {
    const { name, description } = req.body;
    const category = await Category.findById(req.params.id);
    if (!category)
      return res
        .status(404)
        .json({ success: false, message: "Category not found" });

    if (name && name !== category.name) {
      category.name = name;
      category.slug = await generateUniqueSlug(name, category._id);
    }
    if (description) category.description = description;

    await category.save();
    res.json({ success: true, message: "Category updated", data: category });
  } catch (error) {
    next(error);
  }
};

// Delete category
export const deleteCategory = async (req, res, next) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category)
      return res
        .status(404)
        .json({ success: false, message: "Category not found" });

    await category.deleteOne();
    res.json({ success: true, message: "Category deleted" });
  } catch (error) {
    next(error);
  }
};

// Get category by slug
export const getCategoryBySlug = async (req, res, next) => {
  try {
    const category = await Category.findOne({ slug: req.params.slug }).lean();
    if (!category)
      return res
        .status(404)
        .json({ success: false, message: "Category not found" });
    res.json({ success: true, message: "Category fetched", data: category });
  } catch (error) {
    next(error);
  }
};
