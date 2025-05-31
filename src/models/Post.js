import mongoose from "mongoose";

const postSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      // Title of the post
    },
    shortDescription: {
      type: String,
      trim: true,
      default: "",
      // Short description or summary of the post
    },
    content: {
      type: String,
      required: true,
      // Full content/body of the post
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // assuming you have a User model
      required: true,
      // Reference to the author (User)
    },
    slug: {
      type: String,
      unique: true,
      index: true,
    },
    image: {
      url: { type: String, required: false },
      publicId: { type: String, required: false },
    },
  },
  {
    timestamps: true, // automatically add createdAt and updatedAt fields
    versionKey: false,
  }
);

export default mongoose.model("Post", postSchema);
