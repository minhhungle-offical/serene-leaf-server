import mongoose from "mongoose";

const subscribeSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    active: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

const Subscribe = mongoose.model("Subscribe", subscribeSchema);
export default Subscribe;
