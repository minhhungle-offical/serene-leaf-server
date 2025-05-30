import Product from "../models/Product.js";
import cloudinary from "../config/cloudinary.js";

// Create a new product
export const createProduct = async (req, res, next) => {
  try {
    const { name, description, price, quantity, category, shortDescription } =
      req.body;

    // Validate required fields
    if (!name || !price) {
      return res.status(400).json({
        success: false,
        message: "Name and price are required",
      });
    }

    // req.file contains the uploaded file info (single file)
    // file.path is the image URL, file.filename is the publicId on Cloudinary
    const image = req.file
      ? {
          url: req.file.path,
          publicId: req.file.filename,
        }
      : null;

    // Create a new product document
    const newProduct = new Product({
      name,
      shortDescription,
      description,
      price,
      quantity: quantity || 0,
      category,
      image, // store single image as an object {url, publicId}
    });

    // Save product to the database
    const savedProduct = await newProduct.save();

    // Send success response
    res.status(201).json({
      success: true,
      message: "Product created successfully",
      data: savedProduct,
    });
  } catch (error) {
    next(error);
  }
};

// Get all products with advanced filters, search, sort, and pagination
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

    // Text search
    if (search) {
      query.name = { $regex: search, $options: "i" };
    }

    // Category filter
    if (category) {
      query.category = category;
    }

    // Price range filter
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    // Active status
    if (isActive !== undefined) {
      query.isActive = isActive === "true"; // boolean từ query string
    }

    // Sort configuration
    const sortOrder = order === "asc" ? 1 : -1; //asc && desc
    const sortOptions = {};
    sortOptions[sortBy] = sortOrder;

    // Fetch data
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

// Update a product
export const updateProduct = async (req, res, next) => {
  const { image, ...rest } = req.body;
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
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

    if (image.publicId) {
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
