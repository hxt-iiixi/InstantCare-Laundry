// models/User.js
import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    // Auth
    username: { type: String, trim: true },
    email: { type: String, required: true, unique: true, index: true, lowercase: true, trim: true },
    password: { type: String }, 

    // OAuth
    googleId: { type: String, index: true, sparse: true },
    avatar: { type: String },
    name: { type: String, trim: true },

    // Role 
  isVerified: { type: Boolean, default: false },
  role: { type: String, enum: ["member","church-admin","admin","superadmin"], default: "member" },
  regOTP: String,
  regOTPExpiry: Date,

    // OTP (password reset)
    resetOTP: String,
    resetOTPExpiry: Date,

    // OTP (registration) 
    regOTP: String,
    regOTPExpiry: Date,
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
