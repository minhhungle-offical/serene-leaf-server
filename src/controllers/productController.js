import cloudinary from "../config/cloudinary.js";
import { generateUniqueSlug } from "../helper/slugHelper.js";
import Product from "../models/Product.js";

// Create a new product
export const createProduct = async (req, res, next) => {
  try {
    const { name, description, price, quantity, category, shortDescription } =
      req.body;

    if (!name || !price) {
      return res.status(400).json({
        success: false,
        message: "Name and price are required",
      });
    }

    // Generate unique slug
    const slug = await generateUniqueSlug(name);

    const image = req.file
      ? {
          url: req.file.path,
          publicId: req.file.filename,
        }
      : null;

    const newProduct = new Product({
      name,
      slug,
      shortDescription,
      description,
      price,
      quantity: quantity || 0,
      category,
      image,
    });

    const savedProduct = await newProduct.save();

    res.status(201).json({
      success: true,
      message: "Product created successfully",
      data: savedProduct,
    });
  } catch (error) {
    next(error);
  }
};

// Get all products with filters, search, sort, pagination
export const getProducts = async (req, res, next) => {
  try {
    const {
      page = 1,
      limit = 10,
      search = "",
      category,
      minPrice,
      maxPrice,
      isActive,
      sortBy = "createdAt",
      order = "desc",
    } = req.query;

    const query = {};

    if (search) {
      query.name = { $regex: search, $options: "i" };
    }

    if (category) {
      query.category = category;
    }

    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    if (isActive !== undefined) {
      query.isActive = isActive === "true";
    }

    const sortOrder = order === "asc" ? 1 : -1;
    const sortOptions = {};
    sortOptions[sortBy] = sortOrder;

    const products = await Product.find(query)
      .sort(sortOptions)
      .skip((page - 1) * limit)
      .limit(Number(limit))
      .lean();

    const total = await Product.countDocuments(query);

    res.json({
      success: true,
      message: "Products fetched successfully",
      data: {
        data: products,
        meta: {
          total,
          page: Number(page),
          limit: Number(limit),
          totalPages: Math.ceil(total / limit),
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

// Get product by ID
export const getProductById = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    res.json({
      success: true,
      message: "Product retrieved successfully",
      data: product,
    });
  } catch (error) {
    next(error);
  }
};

// Get product by slug
export const getProductBySlug = async (req, res, next) => {
  try {
    const product = await Product.findOne({ slug: req.params.slug });
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    res.json({
      success: true,
      message: "Product retrieved successfully",
      data: product,
    });
  } catch (error) {
    next(error);
  }
};

// Update a product
export const updateProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    const { name, ...rest } = req.body;

    if (!product.slug) {
      product.slug = await generateUniqueSlug(name);
    }

    if (name && name !== product.name) {
      product.slug = await generateUniqueSlug(name, product._id);
      product.name = name;
    }

    Object.assign(product, rest);

    if (req.file) {
      if (product.image && product.image.publicId) {
        await cloudinary.uploader.destroy(product.image.publicId);
      }
      product.image = {
        url: req.file.path,
        publicId: req.file.filename,
      };
    }

    const updatedProduct = await product.save();

    res.json({
      success: true,
      message: "Product updated successfully",
      data: updatedProduct,
    });
  } catch (error) {
    next(error);
  }
};

// Delete a product
export const deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    const image = product.image;

    if (image && image.publicId) {
      await cloudinary.uploader.destroy(image.publicId);
    }
    await product.deleteOne();

    res.json({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};
