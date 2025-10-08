import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import User from "./models/User.js";
import auth from "./middleware/auth.js";
import { sendOTPEmail } from "./utils/mailer.js";
import { OAuth2Client } from "google-auth-library";
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

function signToken(user) {
  return jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET, { expiresIn: "7d" });
}
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

app.post("/api/register", async (req, res) => {
  const { username, email: rawEmail, password } = req.body;
  const email = (rawEmail || "").toLowerCase().trim();

  // Check if user already exists
  const existingUser = await User.findOne({ email });
  if (existingUser) return res.status(400).json({ message: "Email already in use" });

  // Generate OTP
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const expiry = new Date(Date.now() + 10 * 60 * 1000); // OTP valid for 10 minutes

  // Temporarily store OTP (in a separate collection or temp field)
  const otpUser = new User({ email, otp, otpExpiry: expiry });
  await otpUser.save(); // Store in a temporary "OTP" user record

  // Send OTP to user's email
  try {
    await sendOTPEmail(email, otp);  // Send OTP via email
    res.status(200).json({ message: "OTP sent to your email. Please verify it." });
  } catch (err) {
    console.error("Failed to send OTP email:", err);
    res.status(500).json({ message: "Failed to send OTP email" });
  }
});



// Login
app.post("/api/login", async (req, res) => {
  const rawEmail = req.body.email || "";
  const { password } = req.body;

  try {
    const email = rawEmail.toLowerCase().trim();
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // If the account was created with Google, there's no password to compare
    if (!user.password) {
      return res.status(400).json({
        message:
          'This account is linked to Google. Use "Continue with Google" or set a password via "Forgot Password".',
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });
    return res.json({ token, user: { username: user.username, email: user.email } });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
});


// Protected profile route
app.get("/api/profile", auth, (req, res) => {
  res.json({ user: req.user });
});

// ------------------- Forget Password Flow -------------------

// 1) Request OTP
app.post("/api/forget-password", async (req, res) => {
  const email = (req.body.email || "").toLowerCase().trim();   // 👈 normalize
  const user = await User.findOne({ email });
  if (!user) return res.status(400).json({ message: "Email not found" });

  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const expiry = new Date(Date.now() + 10 * 60 * 1000);
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

// 2) Verify OTP
app.post("/api/verify-otp", async (req, res) => {
    const { email, otp } = req.body;
  const user = await User.findOne({ email });

  if (!user) return res.status(400).json({ message: "Email not found." });
  if (user.resetOTP !== otp) return res.status(400).json({ message: "Invalid OTP." });
  if (new Date() > user.resetOTPExpiry) return res.status(400).json({ message: "OTP expired." });

  // Proceed with resetting password
  res.json({ message: "OTP verified for password reset." });
});

// 3) Reset Password
app.post("/api/reset-password", async (req, res) => {
  const email = (req.body.email || "").toLowerCase().trim();   // 👈 normalize
  const { otp, newPassword } = req.body;
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
// Backend: OTP verification for registration (create user after OTP verification)
app.post("/api/verify-otp-registration", async (req, res) => {
  const { email, otp } = req.body;
  const otpUser = await User.findOne({ email });

  if (!otpUser) return res.status(400).json({ message: "No user found with this email." });
  if (otpUser.otp !== otp) return res.status(400).json({ message: "Invalid OTP." });
  if (new Date() > otpUser.otpExpiry) return res.status(400).json({ message: "OTP expired." });

  // OTP is valid, now create the user
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 12);  // Create user with password
    const newUser = new User({
      username: req.body.username,
      email,
      password: hashedPassword
    });

    await newUser.save();
    res.status(201).json({ message: "User successfully registered!" });

    // Optionally, delete the temporary OTP user record
    await otpUser.remove();
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).json({ message: "Error creating user" });
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
// ========== Google OAuth setup ==========
const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);


// Google OAuth: verify ID token, find-or-create user, return app JWT
app.post("/api/auth/google", async (req, res) => {
  try {
    const { credential } = req.body; // Google ID token from the frontend
    if (!credential) return res.status(400).json({ message: "Missing credential" });

    const ticket = await googleClient.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload(); // { email, email_verified, name, picture, sub, ... }

    if (!payload?.email || !payload?.email_verified) {
      return res.status(401).json({ message: "Google account not verified." });
    }

    const email = String(payload.email).toLowerCase();
    const googleId = payload.sub;
    const name = payload.name || email.split("@")[0];
    const avatar = payload.picture;

    // Find or create user
    let user = await User.findOne({ email });
    if (!user) {
      user = await User.create({
        email,
        name,
        username: name,     // keeps parity with your register payload
        avatar,
        googleId,
        password: undefined // no password for Google users
      });
    } else if (!user.googleId) {
      // Link Google to an existing email/password account
      user.googleId = googleId;
      user.name ??= name;
      user.avatar ??= avatar;
      await user.save();
    }

    const token = signToken(user);
    return res.json({
      token,
      user: { username: user.username || user.name, email: user.email, name: user.name, avatar: user.avatar },
      needsPassword: !user.password,
    });
  } catch (err) {
    console.error("Google OAuth error:", err);
    return res.status(401).json({ message: "Google sign-in failed." });
  }
});

// Set / create a local password for the current (Google-authenticated) user
app.post("/api/set-password", auth, async (req, res) => {
  try {
    const { newPassword } = req.body;
    if (!newPassword || newPassword.length < 8) {
      return res.status(400).json({ message: "Password must be at least 8 characters." });
    }
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.password = await bcrypt.hash(newPassword, 12);
    await user.save();

    res.json({ message: "Password set successfully." });
  } catch (e) {
    console.error("set-password error:", e);
    res.status(500).json({ message: "Server error" });
  }
});

// LOGIN-ONLY with Google (no auto-create)
app.post("/api/auth/google/login", async (req, res) => {
  try {
    const { credential } = req.body;
    if (!credential) return res.status(400).json({ message: "Missing credential" });

    const ticket = await googleClient.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();
    const email = payload?.email?.toLowerCase();
    if (!email || !payload?.email_verified) {
      return res.status(401).json({ message: "Google account not verified." });
    }

    let user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "No account with this Google email. Please register first." });
    }

    // link googleId if it wasn't saved yet
    if (!user.googleId) {
      user.googleId = payload.sub;
      user.avatar ??= payload.picture;
      user.name ??= payload.name || email.split("@")[0];
      await user.save();
    }

    const token = signToken(user);
    return res.json({
      token,
      user: { username: user.username || user.name, email: user.email, name: user.name, avatar: user.avatar },
    });
  } catch (err) {
    console.error("Google login-only error:", err);
    return res.status(401).json({ message: "Google sign-in failed." });
  }
});
start();
