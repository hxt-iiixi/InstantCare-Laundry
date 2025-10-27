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
import churchAdminRoutes from "./routes/churchAdminRoutes.js";
import ChurchApplication from "./models/ChurchApplication.js";
import eventRoutes from "./routes/eventRoutes.js";
import path from "path";
import { createServer } from "http";
import { Server as SocketIOServer } from "socket.io";





dotenv.config();

const app = express();
app.use(cors({ origin: "http://localhost:5173" }));
app.use(express.json());
app.use("/uploads", express.static("uploads"));
app.use("/api/church-admin", churchAdminRoutes); 
app.use("/api/events", eventRoutes);

const ServiceSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: String,
  pricePerKg: Number,
});
const Service = mongoose.model("Service", ServiceSchema);

const httpServer = createServer(app);
const io = new SocketIOServer(httpServer, {
  cors: { origin: "http://localhost:5173" },
});
app.set("io", io);
io.on("connection", (socket) => {
  socket.on("join:church", (churchId) => {
    if (churchId) socket.join(`church:${churchId}`);
  });
});


// start (use httpServer.listen now)
httpServer.listen(PORT, () =>
  console.log(`✅ API running on http://localhost:${PORT}`)
);


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

 async function ensureChurchAdminApproved(user) {
  if (user?.role === "church-admin") {
    const app = await ChurchApplication.findOne({ email: user.email.toLowerCase() }).lean();
    if (!app || app.status !== "approved") {
      const err = new Error("Your church admin application is under review. You’ll be able to log in once it’s approved.");
      err.status = 403;
      err.code = "UNDER_REVIEW";
      throw err;
    }
  }
}
async function seedSuperAdmin() {
  const email = "AmpowerAdmin@gmail.com".toLowerCase(); 
  const plain = "Ampower123";

  let user = await User.findOne({ email });
  const hash = await bcrypt.hash(plain, 12);

  if (!user) {
    user = await User.create({
      email,
      username: "AmPower Super Admin",
      name: "AmPower Super Admin",
      password: hash,
      role: "superadmin",
      isVerified: true,
    });
    console.log("✅ Super admin created:", email);
  } else {
    // keep it enforced as superadmin with the given password & verified
    user.role = "superadmin";
    user.isVerified = true;
    user.password = hash;
    await user.save();
    console.log("✅ Super admin ensured:", email);
  }
}
app.get("/", (_req, res) => res.send("Welcome to InstantCare Laundry API!"));
app.get("/api/health", (_req, res) => res.json({ ok: true }));


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



app.post("/api/register", async (req, res) => {
  try {
    const { username, email: rawEmail, password, churchCode } = req.body;
    const email = (rawEmail || "").toLowerCase().trim();

    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ message: "Email already in use" });

    const hash = await bcrypt.hash(password, 12);

    let churchRef = null;
    if (churchCode && churchCode.trim()) {
      const appDoc = await ChurchApplication.findOne({
        joinCode: churchCode.trim().toUpperCase(),
        status: "approved",
      }).lean();
      if (!appDoc) return res.status(400).json({ message: "Invalid church code." });
      churchRef = appDoc._id;
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiry = new Date(Date.now() + 10 * 60 * 1000);

    await User.create({
      username,
      email,
      password: hash,
      role: "member",
      isVerified: false,
      regOTP: otp,
      regOTPExpiry: expiry,
      churchRef, // <- link to the church
    });

    await sendOTPEmail(email, `Your AmPower verification code is: ${otp}`);
    res.status(200).json({ message: "OTP sent to your email. Please verify it." });
  } catch (err) {
    console.error("register error:", err);
    res.status(500).json({ message: "Server error" });
  }
});


// Login
// Login route
app.post("/api/login", async (req, res) => {
  const rawEmail = req.body.email || "";
  const { password } = req.body;

  try {
    const email = rawEmail.toLowerCase().trim();
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    // (optional) block pending church-admins
    await ensureChurchAdminApproved(user).catch((e) => { throw e; });

    if (!user.password) {
      return res.status(400).json({
        message:
          'This account is linked to Google. Use "Continue with Google" or set a password via "Forgot Password".',
      });
    }
    if (user.role !== "superadmin" && !user.isVerified) {
      return res.status(403).json({ message: "Please verify your email before logging in." });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });

    // If the user is a church-admin, include the church name
    const churchName = user.role === "church-admin" ? user.name : null;

    return res.json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        username: user.username,
        name: user.name,  // Ensure name is included here
        email: user.email,
        role: user.role,  // Include role for role-based routing
        isVerified: user.isVerified,
        churchName: churchName,  // Include church name if church-admin
      }
    });
  } catch (error) {
    if (error.code === "UNDER_REVIEW") {
      return res.status(403).json({ message: error.message, code: error.code });
    }
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
});




app.get("/api/profile", auth, (req, res) => {
  res.json({ user: req.user });
});



// 1) Request OTP
app.post("/api/forget-password", async (req, res) => {
  const email = (req.body.email || "").toLowerCase().trim();   // normalize
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
app.post("/api/verify-otp-registration", async (req, res) => {
  const { email: rawEmail, otp } = req.body;
  const email = (rawEmail || "").toLowerCase().trim();

  const user = await User.findOne({ email });
  if (!user) return res.status(400).json({ message: "No user found with this email." });
  if (user.isVerified) return res.status(200).json({ message: "Already verified." });

  if (user.regOTP !== otp) return res.status(400).json({ message: "Invalid OTP." });
  if (new Date() > user.regOTPExpiry) return res.status(400).json({ message: "OTP expired." });

  user.isVerified = true;
  user.regOTP = undefined;
  user.regOTPExpiry = undefined;
  await user.save();

  res.json({ message: "Email verified." });
});

app.post("/api/resend-otp-registration", async (req, res) => {
  const email = (req.body.email || "").toLowerCase().trim();
  const user = await User.findOne({ email });
  if (!user) return res.status(400).json({ message: "Email not found." });
  if (user.isVerified) return res.status(400).json({ message: "Account already verified." });

  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  user.regOTP = otp;
  user.regOTPExpiry = new Date(Date.now() + 10 * 60 * 1000);
  await user.save();

  try {
    await sendOTPEmail(email, `Your new AmPower verification code is: ${otp}`);
    res.json({ message: "OTP sent." });
  } catch (e) {
    console.error("resend-otp-registration error:", e);
    res.status(500).json({ message: "Failed to send OTP email" });
  }
});

// ------------------- Start Server -------------------
const PORT = process.env.PORT || 4000;

async function start() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ MongoDB connected");
     await seedSuperAdmin();
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
    const { credential } = req.body;
    if (!credential) return res.status(400).json({ message: "Missing credential" });

    const ticket = await googleClient.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();

    if (!payload?.email || !payload?.email_verified) {
      return res.status(401).json({ message: "Google account not verified." });
    }

    const email = String(payload.email).toLowerCase();
    const googleId = payload.sub;
    const name = payload.name || email.split("@")[0];
    const avatar = payload.picture;

    let user = await User.findOne({ email });

    if (!user) {
      // New user created via Google is a member by default
      user = await User.create({
        email,
        name,
        username: name,
        avatar,
        googleId,
        password: undefined,
        // role default in schema should be "member"
      });
    } else if (!user.googleId) {
      user.googleId = googleId;
      user.name ??= name;
      user.avatar ??= avatar;
      await user.save();
    }

    // block pending church-admins here too
    await ensureChurchAdminApproved(user);

    const token = signToken(user);
    return res.json({
      token,
      user: { username: user.username || user.name, email: user.email, name: user.name, avatar: user.avatar,   role: user.role,    },
      needsPassword: !user.password,
    });
  } catch (err) {
    if (err.code === "UNDER_REVIEW") {
      return res.status(403).json({ message: err.message, code: err.code });
    }
    console.error("Google OAuth error:", err?.message || err);
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

// LOGIN-ONLY with Google 
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

    // link googleId if missing
    if (!user.googleId) {
      user.googleId = payload.sub;
      user.avatar ??= payload.picture;
      user.name ??= payload.name || email.split("@")[0];
      await user.save();
    }

    // ✅ block pending admins
    await ensureChurchAdminApproved(user);

    const token = signToken(user);
    return res.json({
      token,
      user: { username: user.username || user.name, email: user.email, name: user.name, avatar: user.avatar },
    });
  } catch (err) {
    // If our guard threw:
    if (err.code === "UNDER_REVIEW") {
      return res.status(403).json({ message: err.message, code: err.code });
    }
    // Otherwise it's a token/audience/origin issue etc.
    console.error("Google login-only error:", err?.message || err);
    return res.status(401).json({ message: "Google sign-in failed." });
  }
});

// Member: get my joined church info (used by MemberDash)
app.get("/api/members/me/church", auth, async (req, res) => {
  try {
    const u = await User.findById(req.user._id).lean();
    if (!u?.churchRef) return res.json({ church: null });

    const appDoc = await ChurchApplication.findById(u.churchRef).lean();
    if (!appDoc) return res.json({ church: null });

    res.json({
      church: {
        id: String(appDoc._id),
        name: appDoc.churchName,
        joinCode: appDoc.joinCode || null,
        status: appDoc.status,
      },
    });
  } catch (e) {
    console.error("GET /api/members/me/church error:", e.message);
    res.status(500).json({ message: "Server error" });
  }
});




start();
