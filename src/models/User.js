import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    // User's full name
    name: {
      type: String,
      trim: true,
      maxlength: 100,
    },

    // User's email address, unique and required, must be a valid email format
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      match: [/.+@.+\..+/, "Please enter a valid email address"],
    },

    // User's address
    address: {
      type: String,
      trim: true,
      maxlength: 200,
    },

    // User's phone number, simple regex for basic validation
    phoneNumber: {
      type: String,
      trim: true,
      match: [/^\+?\d{7,15}$/, "Please enter a valid phone number"],
    },

    // Password for the account, required and minimum length 6 characters
    password: {
      type: String,
      required: true,
      minlength: 6,
    },

    // Role of the user, default is 'user', can be 'admin'
    role: {
      type: String,
      enum: ["user", "admin", "customer"],
      default: "customer",
    },
  },
  {
    // Automatically add createdAt and updatedAt timestamps
    timestamps: true,
    versionKey: false, // disable __v field
  }
);

const User = mongoose.model("User", userSchema);

export default User;
