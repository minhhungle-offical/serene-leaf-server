import Post from "../models/Post.js";
import { generateUniqueSlug } from "../helper/slugHelper.js";
import cloudinary from "../config/cloudinary.js"; // nếu có upload ảnh

// Create new post
export const createPost = async (req, res, next) => {
  try {
    const { title, shortDescription = "", content } = req.body;
    const author = req.user._id;

    if (!title || !content) {
      return res.status(400).json({
        success: false,
        message: "Title, content are required",
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
    });

    await newPost.save();

    res.status(201).json({
      success: true,
      message: "Post created successfully",
      data: newPost,
    });
  } catch (error) {
    next(error);
  }
};

// Get all posts (pagination, search by title)
export const getPosts = async (req, res, next) => {
  try {
    const {
      page = 1,
      limit = 10,
      search = "",
      sortBy = "createdAt",
      order = "desc",
    } = req.query;

    const query = {};
    if (search) {
      query.title = { $regex: search, $options: "i" };
    }

    const sortOrder = order === "asc" ? 1 : -1;
    const sortOptions = { [sortBy]: sortOrder };

    const posts = await Post.find(query)
      .populate("author", "name email") // populate author (lấy tên, email)
      .sort(sortOptions)
      .skip((page - 1) * limit)
      .limit(Number(limit))
      .lean();

    const total = await Post.countDocuments(query);

    res.json({
      success: true,
      message: "Posts fetched successfully",
      data: {
        data: posts,
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

// Get post by slug
export const getPostBySlug = async (req, res, next) => {
  try {
    const post = await Post.findOne({ slug: req.params.slug }).populate(
      "author",
      "name email"
    );

    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found",
      });
    }

    res.json({
      success: true,
      message: "Post retrieved successfully",
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
        message: "Post not found",
      });
    }

    res.json({
      success: true,
      message: "Post retrieved successfully",
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
        message: "Post not found",
      });
    }

    const { title, shortDescription, content, author } = req.body;

    if (title && title !== post.title) {
      post.slug = await generateUniqueSlug(title, post._id);
      post.title = title;
    }

    if (shortDescription !== undefined)
      post.shortDescription = shortDescription;
    if (content !== undefined) post.content = content;
    if (author !== undefined) post.author = author;

    // Handle image update
    if (req.file) {
      if (post.image && post.image.publicId) {
        await cloudinary.uploader.destroy(post.image.publicId);
      }
      post.image = {
        url: req.file.path,
        publicId: req.file.filename,
      };
    }

    const updatedPost = await post.save();

    res.json({
      success: true,
      message: "Post updated successfully",
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
        message: "Post not found",
      });
    }

    if (post.image && post.image.publicId) {
      await cloudinary.uploader.destroy(post.image.publicId);
    }

    await post.deleteOne();

    res.json({
      success: true,
      message: "Post deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};
