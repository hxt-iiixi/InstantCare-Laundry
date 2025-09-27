// models/User.js
import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    username: { type: String },
    email: { type: String, required: true, unique: true, index: true, lowercase: true, trim: true },
    password: { type: String }, // optional for Google users
    // --- OAuth fields ---
    googleId: { type: String, index: true, sparse: true },
    avatar: { type: String },
    name: { type: String },
    // --- OTP reset fields (you already use these) ---
    resetOTP: String,
    resetOTPExpiry: Date,
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
