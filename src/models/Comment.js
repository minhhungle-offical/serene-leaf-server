import mongoose from "mongoose";

const commentSchema = new mongoose.Schema(
  {
    // Reference to the user who made the comment
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // Reference to the product the comment belongs to
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },

    // The content/text of the comment
    content: {
      type: String,
      required: true,
      trim: true,
      maxlength: 1000,
    },

    // Rating given by the user (1 to 5)
    rating: {
      type: Number,
      min: 1,
      max: 5,
      default: 5,
    },

    // Whether the comment is approved/visible
    isApproved: {
      type: Boolean,
      default: false,
    },
  },
  {
    // Automatically add createdAt and updatedAt fields
    timestamps: true,
    versionKey: false, // disable __v field
  }
);

const Comment = mongoose.model("Comment", commentSchema);

export default Comment;
