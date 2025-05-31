import Post from "../models/Post.js";
import { generateUniqueSlug } from "../helper/slugHelper.js";
import cloudinary from "../config/cloudinary.js";

// Create new post
export const createPost = async (req, res, next) => {
  try {
    const {
      title,
      shortDescription = "",
      content,
      category,
      isActive = false,
    } = req.body;

    const author = req.user?._id;

    if (!title || !content) {
      return res.status(400).json({
        success: false,
        message: "Title and content are required.",
      });
    }

    const slug = await generateUniqueSlug(title);

    const image = req.file
      ? {
          url: req.file.path,
          publicId: req.file.filename,
        }
      : null;

    const newPost = new Post({
      title,
      shortDescription,
      content,
      author,
      slug,
      image,
      category,
      isActive,
    });

    await newPost.save();

    return res.status(201).json({
      success: true,
      message: "Post created successfully.",
      data: newPost,
    });
  } catch (error) {
    next(error);
  }
};

// Get all posts with pagination, filtering, and sorting
export const getPosts = async (req, res, next) => {
  try {
    const {
      page = 1,
      limit = 10,
      search = "",
      category = "",
      isActive,
      sortBy = "createdAt",
      order = "desc",
    } = req.query;

    const query = {};

    if (search) {
      query.title = { $regex: search, $options: "i" };
    }

    if (category) {
      query.category = category;
    }

    // isActive can be 'true' or 'false' as string from query
    if (isActive === "true") query.isActive = true;
    else if (isActive === "false") query.isActive = false;

    const sortOrder = order === "asc" ? 1 : -1;
    const sortOptions = { [sortBy]: sortOrder };

    const pageNumber = parseInt(page, 10);
    const limitNumber = parseInt(limit, 10);

    const posts = await Post.find(query)
      .populate("author", "name email")
      .populate("category", "name slug")
      .sort(sortOptions)
      .skip((pageNumber - 1) * limitNumber)
      .limit(limitNumber)
      .lean();

    const total = await Post.countDocuments(query);

    return res.json({
      success: true,
      message: "Posts fetched successfully.",
      data: {
        data: posts,
        meta: {
          total,
          page: pageNumber,
          limit: limitNumber,
          totalPages: Math.ceil(total / limitNumber),
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

// Get post by slug
export const getPostBySlug = async (req, res, next) => {
  try {
    const post = await Post.findOne({ slug: req.params.slug })
      .populate("author", "name email")
      .populate("category", "name slug");

    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found.",
      });
    }

    return res.json({
      success: true,
      message: "Post retrieved successfully.",
      data: post,
    });
  } catch (error) {
    next(error);
  }
};

// Get post by ID
export const getPostById = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id).populate(
      "author",
      "name email"
    );

    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found.",
      });
    }

    return res.json({
      success: true,
      message: "Post retrieved successfully.",
      data: post,
    });
  } catch (error) {
    next(error);
  }
};

// Update post by ID
export const updatePost = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found.",
      });
    }

    const { title, shortDescription, content, category, isActive } = req.body;

    // Update slug only if title changed
    if (title && title !== post.title) {
      post.slug = await generateUniqueSlug(title, post._id);
      post.title = title;
    }

    if (shortDescription !== undefined)
      post.shortDescription = shortDescription;
    if (content !== undefined) post.content = content;
    if (category !== undefined) post.category = category;
    if (typeof isActive === "boolean") post.isActive = isActive;

    // Handle image update
    if (req.file) {
      if (post.image?.publicId) {
        await cloudinary.uploader.destroy(post.image.publicId);
      }
      post.image = {
        url: req.file.path,
        publicId: req.file.filename,
      };
    }

    const updatedPost = await post.save();

    return res.json({
      success: true,
      message: "Post updated successfully.",
      data: updatedPost,
    });
  } catch (error) {
    next(error);
  }
};

// Delete post by ID
export const deletePost = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found.",
      });
    }

    if (post.image?.publicId) {
      await cloudinary.uploader.destroy(post.image.publicId);
    }

    await post.deleteOne();

    return res.json({
      success: true,
      message: "Post deleted successfully.",
    });
  } catch (error) {
    next(error);
  }
};
