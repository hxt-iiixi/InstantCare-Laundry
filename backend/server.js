import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import User from "./models/User.js";
import auth from "./middleware/auth.js";
import { sendOTPEmail } from "./utils/mailer.js";

dotenv.config();

const app = express();
app.use(cors({ origin: "http://localhost:5173" }));
app.use(express.json());

// ------------------- Services & Orders Models -------------------

const ServiceSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: String,
  pricePerKg: Number,
});
const Service = mongoose.model("Service", ServiceSchema);

const OrderSchema = new mongoose.Schema(
  {
    customerName: { type: String, required: true },
    phone: { type: String, required: true },
    address: { type: String, required: true },
    serviceId: { type: mongoose.Schema.Types.ObjectId, ref: "Service", required: true },
    pickupDate: { type: Date, required: true },
    notes: String,
    status: {
      type: String,
      enum: ["pending", "picked-up", "in-process", "ready", "delivered"],
      default: "pending",
    },
  },
  { timestamps: true }
);
const Order = mongoose.model("Order", OrderSchema);

// ------------------- Routes -------------------

// Health check
app.get("/", (_req, res) => res.send("Welcome to InstantCare Laundry API!"));
app.get("/api/health", (_req, res) => res.json({ ok: true }));

// ------------------- Services -------------------
app.get("/api/services", async (_req, res) => {
  const items = await Service.find().lean();
  res.json(items);
});

app.post("/api/services", async (req, res) => {
  try {
    const s = await Service.create(req.body);
    res.status(201).json(s);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

// ------------------- Orders (Protected) -------------------
app.get("/api/orders", auth, async (_req, res) => {
  const items = await Order.find().populate("serviceId").lean();
  res.json(items);
});

app.post("/api/orders", auth, async (req, res) => {
  try {
    const o = await Order.create(req.body);
    res.status(201).json(o);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

// ------------------- User Routes -------------------

// Register
app.post("/api/register", async (req, res) => {
  const { username, email, password } = req.body;
  const existingUser = await User.findOne({ email });
  if (existingUser) return res.status(400).json({ message: "Email already in use" });

  try {
    const hashedPassword = await bcrypt.hash(password, 12);
    const newUser = new User({ username, email, password: hashedPassword });
    await newUser.save();

    const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, { expiresIn: "1h" });

    res.status(201).json({
      message: "User registered successfully",
      token,
      user: { username: newUser.username, email: newUser.email },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

// Login
app.post("/api/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });

    res.json({ token, user: { username: user.username, email: user.email } });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

// Protected profile route
app.get("/api/profile", auth, (req, res) => {
  res.json({ user: req.user });
});

// ------------------- Forget Password Flow -------------------

// 1. Request OTP
app.post("/api/forget-password", async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.status(400).json({ message: "Email not found" });

  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const expiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

  user.resetOTP = otp;
  user.resetOTPExpiry = expiry;
  await user.save();

  try {
    await sendOTPEmail(email, otp);
    res.json({ message: "OTP sent to your email" });
  } catch (err) {
    console.error("Failed to send OTP email:", err);
    res.status(500).json({ message: "Failed to send OTP email" });
  }
});

// 2. Verify OTP
app.post("/api/verify-otp", async (req, res) => {
  const { email, otp } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.status(400).json({ message: "Email not found" });

  if (user.resetOTP !== otp) return res.status(400).json({ message: "Invalid OTP" });
  if (new Date() > user.resetOTPExpiry) return res.status(400).json({ message: "OTP expired" });

  res.json({ message: "OTP verified successfully" });
});

// 3. Reset Password
app.post("/api/reset-password", async (req, res) => {
  const { email, otp, newPassword } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.status(400).json({ message: "Email not found" });

  if (user.resetOTP !== otp) return res.status(400).json({ message: "Invalid OTP" });
  if (new Date() > user.resetOTPExpiry) return res.status(400).json({ message: "OTP expired" });

  try {
    user.password = await bcrypt.hash(newPassword, 12);
    user.resetOTP = undefined;
    user.resetOTPExpiry = undefined;
    await user.save();

    res.json({ message: "Password reset successfully" });
  } catch (err) {
    console.error("Reset password error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// ------------------- Start Server -------------------
const PORT = process.env.PORT || 4000;

async function start() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ MongoDB connected");
    app.listen(PORT, () => console.log(`✅ API running on http://localhost:${PORT}`));
  } catch (err) {
    console.error("❌ MongoDB connection failed:", err.message);
    process.exit(1);
  }
}

start();
