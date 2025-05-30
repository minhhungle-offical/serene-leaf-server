import mongoose from "mongoose";

const otpSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, index: true },
    code: { type: String, required: true },
    expireAt: { type: Date, required: true, index: { expires: 0 } }, // TTL index to auto-delete expired OTPs
  },
  { versionKey: false }
);

const Otp = mongoose.model("Otp", otpSchema);

export default Otp;
