//Server.js
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
import ministryRoutes from "./routes/ministryRoutes.js";
import multer from "multer";
import { Server } from "lucide-react";



dotenv.config();

const app = express();
app.use(cors({
   origin: ["http://localhost:5173", "http://127.0.0.1:5173", "http://localhost:5174"],
   methods: ["GET","POST","PUT","PATCH","DELETE","OPTIONS"],
   allowedHeaders: ["Content-Type","Authorization"],
  credentials: true
}));

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, "uploads"),
  filename: (_req, file, cb) => cb(null, `${Date.now()}_${file.originalname.replace(/\s+/g,"_")}`)
});
const upload = multer({ storage });
app.use(express.json());
app.use("/uploads", express.static("uploads"));
app.use("/api/church-admin", churchAdminRoutes); 
app.use("/api/events", eventRoutes);
app.use("/api/ministries", ministryRoutes);
const ServiceSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: String,
  pricePerKg: Number,
});
const Service = mongoose.model("Service", ServiceSchema);

const httpServer = createServer(app);
const io = new SocketIOServer(httpServer, {
   cors: {
     origin: ["http://localhost:5173", "http://127.0.0.1:5173", "http://localhost:5174"],
     credentials: true,
   },
});
app.set("io", io);
io.on("connection", (socket) => {
    socket.join("all");
  socket.on("join:church", (churchId) => {
    if (churchId) socket.join(`church:${churchId}`);
  });
});

const AnnouncementSchema = new mongoose.Schema(
  {
    content: { type: String, required: true },
    audience: { type: String, default: "all" }, // "all" | "member" | "church-admin" | "superadmin" | etc.
    active: { type: Boolean, default: true },
  },
  { timestamps: true }
);
const Announcement = mongoose.model("Announcement", AnnouncementSchema);
// Create announcement (superadmin only) and broadcast
app.post("/api/announcements", auth, async (req, res) => {
  try {
    if (req.user.role !== "superadmin") return res.status(403).json({ message: "Forbidden" });
    const { content, audience = "all" } = req.body;
    const doc = await Announcement.create({ content, audience });

    // Broadcast to everyone; client will filter by audience locally (and server filters on fetch)
    const io = req.app.get("io");
    io.to("all").emit("announcement:new", {
      id: String(doc._id),
      content: doc.content,
      audience: doc.audience,
      createdAt: doc.createdAt,
    });

    res.json({ ok: true, id: String(doc._id) });
  } catch (e) {
    console.error("POST /api/announcements error:", e);
    res.status(500).json({ message: "Server error" });
  }
});

app.get("/api/announcements/latest", auth, async (req, res) => {
  try {
    const role = req.user.role || "member";
    const doc = await Announcement.findOne({
      active: true,
      $or: [{ audience: "all" }, { audience: role }],
    })
      .sort({ createdAt: -1 })
      .lean();

    if (!doc) return res.json({ announcement: null });
    res.json({
      announcement: {
        id: String(doc._id),
        content: doc.content,
        audience: doc.audience,
        createdAt: doc.createdAt,
      },
    });
  } catch (e) {
    console.error("GET /api/announcements/latest error:", e);
    res.status(500).json({ message: "Server error" });
  }
});

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
      churchRef,
      status: "inactive",
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




// Get full profile
app.get("/api/me/profile", auth, async (req, res) => {
  const u = await User.findById(req.user._id).lean();
  if (!u) return res.status(404).json({ message: "Not found" });
  const { password, regOTP, resetOTP, ...safe } = u;
  res.json({ user: { id: String(u._id), ...safe } });
});

// Update profile (text fields)
app.patch("/api/me/profile", auth, async (req, res) => {
  const allowed = ["name","firstName","lastName","bio","phone","dob","avatar","cover"];
  const update = {};
  for (const k of allowed) if (k in req.body) update[k] = req.body[k];
  const u = await User.findByIdAndUpdate(req.user._id, { $set: update }, { new: true }).lean();
  const { password, regOTP, resetOTP, ...safe } = u;
  res.json({ user: { id: String(u._id), ...safe } });
});

// Upload avatar/cover
app.post("/api/me/upload", auth, upload.single("file"), async (req, res) => {
  if (!req.file) return res.status(400).json({ message: "No file" });
  const field = req.query.field === "cover" ? "cover" : "avatar";
  const url = `/uploads/${req.file.filename}`;
  await User.findByIdAndUpdate(req.user._id, { $set: { [field]: url } });
  res.json({ field, url });
});

// Change password (optional; if you show change-password inputs)
app.post("/api/me/change-password", auth, async (req, res) => {
  const { current, next } = req.body || {};
  const u = await User.findById(req.user._id);
  if (!u?.password) return res.status(400).json({ message: "Account uses Google Sign-In." });
  const ok = await bcrypt.compare(current || "", u.password);
  if (!ok) return res.status(400).json({ message: "Current password is incorrect." });
  u.password = await bcrypt.hash(next, 12);
  await u.save();
  res.json({ ok: true });
});

app.get("/api/church-admin/applications/:id", auth, async (req, res) => {
  const doc = await ChurchApplication.findById(req.params.id).lean();
  if (!doc) return res.status(404).json({ message: "Not found" });
  res.json({
    church: {
      id: String(doc._id),
      churchName: doc.churchName || "",
      city: doc.city || "",
      province: doc.province || "",
      address: doc.address || "",
      contactNumber: doc.contactNumber || "",
      bio: doc.bio || "",
      avatar: doc.avatar || "",
      cover: doc.cover || "",
      email: doc.email || ""     
    }
  });
});
app.post("/api/church-admin/applications/:id/join-code", auth, async (req, res) => {
  try {
    const id = req.params.id;
    const appDoc = await ChurchApplication.findById(id);
    if (!appDoc) return res.status(404).json({ message: "Church not found" });

    // permission: only superadmin or that church's admin
    if (req.user.role !== "church-admin") {
      const mine = await ChurchApplication.findOne({ email: req.user.email.toLowerCase() }).lean();
      if (!mine || String(mine._id) !== String(id)) {
        return res.status(403).json({ message: "Forbidden" });
      }
    }

    if (!appDoc.joinCode) {
      appDoc.joinCode = Math.random().toString(36).slice(2, 8).toUpperCase(); // 6 chars
      await appDoc.save();
    }

    res.json({ joinCode: appDoc.joinCode });
  } catch (e) {
    console.error("POST /join-code error:", e);
    res.status(500).json({ message: "Server error" });
  }
});
// Update church profile (text fields)
app.patch("/api/church-admin/applications/:id/profile", auth, async (req, res) => {
  const allowed = ["churchName","city","province","address","contactNumber","bio","avatar","cover"];
  const update = {};
  allowed.forEach(k => { if (k in req.body) update[k] = req.body[k]; });
  const doc = await ChurchApplication.findByIdAndUpdate(req.params.id, { $set: update }, { new: true }).lean();
  res.json({
    church: {
      id: String(doc._id),
      churchName: doc.churchName || "",
      city: doc.city || "",
      province: doc.province || "",
      address: doc.address || "",
      contactNumber: doc.contactNumber || "",
      bio: doc.bio || "",
      avatar: doc.avatar || "",
      cover: doc.cover || ""
    }
  });
});

// Upload church avatar/cover
app.post("/api/church-admin/applications/:id/upload", auth, upload.single("file"), async (req, res) => {
  if (!req.file) return res.status(400).json({ message: "No file" });
  const field = req.query.field === "cover" ? "cover" : "avatar";
  const url = `/uploads/${req.file.filename}`;
  await ChurchApplication.findByIdAndUpdate(req.params.id, { $set: { [field]: url } });
  res.json({ field, url });
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
    // start (use httpServer.listen now)
httpServer.listen(PORT, () =>
  console.log(`✅ API running on http://localhost:${PORT}`)
);

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
    let churchName = null;
      if (user.role === "church-admin") {
        const appDoc = await ChurchApplication
          .findOne({ email: user.email.toLowerCase() })
          .lean();
        churchName = appDoc?.churchName || user.name || user.username || null;
      }

      return res.json({
        token,
        user: {
          username: user.username || user.name,
          email: user.email,
          name: user.name,
          avatar: user.avatar,
          role: user.role,
          churchName,      // 👈 add this
        },
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

    // block pending church-admins
    await ensureChurchAdminApproved(user);

   let churchName = null;
    if (user.role === "church-admin") {
      const appDoc = await ChurchApplication
        .findOne({ email: user.email.toLowerCase() })
        .lean();
      churchName = appDoc?.churchName || user.name || user.username || null;
    }

    const token = signToken(user);
    return res.json({
      token,
      user: {
        id: user._id,
        username: user.username || user.name,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        role: user.role,
        isVerified: user.isVerified,
        churchName, // 👈 now provided like manual login
      },
    });
  } catch (err) {
    if (err.code === "UNDER_REVIEW") {
      return res.status(403).json({ message: err.message, code: err.code });
    }
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
app.get("/api/church-admin/members", auth, async (req, res) => {
  try {
    // allow superadmin to specify any church; church-admin defaults to their own church
    let { churchId } = req.query;

    if (req.user.role === "church-admin" && !churchId) {
      const appDoc = await ChurchApplication.findOne({ email: req.user.email.toLowerCase() }).lean();
      if (!appDoc) return res.json({ users: [] });
      churchId = String(appDoc._id);
    }

    if (!churchId) return res.status(400).json({ message: "Missing churchId" });

    // only members attached to that church
  const users = await User.find(
    { role: "member", churchRef: churchId },
    { _id: 1, name: 1, username: 1, email: 1, avatar: 1, role: 1, churchRef: 1, phone: 1, dob: 1, status: 1 }
  ).sort({ createdAt: -1 }).lean();

    res.json({ users });
  } catch (e) {
    console.error("GET /api/church-admin/members error:", e);
    res.status(500).json({ message: "Server error" });
  }
});
// --- Devotion Prompts (server-backed) ---
const DevotionPromptSchema = new mongoose.Schema({
  churchRef: { type: mongoose.Schema.Types.ObjectId, ref: "ChurchApplication", required: true, index: true },
  dateKey:   { type: String, required: true, index: true }, // "YYYY-MM-DD" Asia/Manila
  items:     { type: [String], default: [] },
}, { timestamps: true });
DevotionPromptSchema.index({ churchRef: 1, dateKey: 1 }, { unique: true });
const DevotionPrompt = mongoose.model("DevotionPrompt", DevotionPromptSchema);

async function fetchRandomVersePrimary() {
  const res = await fetch("https://bible-api.com/data/web/random");
  if (!res.ok) throw new Error(`bible-api status ${res.status}`);
  const data = await res.json();
  const v = Array.isArray(data.verses) ? data.verses[0] : data;
  const text = (v?.text || "").trim();
  const reference = v?.book_name ? `${v.book_name} ${v.chapter}:${v.verse}` : v?.reference || "";
  if (!text || !reference) throw new Error("bible-api missing fields");
  return { text, reference, translation: "WEB", source: "bible-api" };
}
async function fetchRandomVerseFallback() {
  const res = await fetch("https://beta.ourmanna.com/api/v1/get/?format=json&order=random");
  if (!res.ok) throw new Error(`ourmanna status ${res.status}`);
  const data = await res.json();
  const text = (data?.verse?.details?.text || "").trim();
  const reference = data?.verse?.details?.reference || "";
  if (!text || !reference) throw new Error("ourmanna missing fields");
  return { text, reference, translation: "KJV/varies", source: "ourmanna" };
}
async function fetchServerVerse() {
  try {
    return await fetchRandomVersePrimary();
  } catch {
    return await fetchRandomVerseFallback();
  }
}

/**
 * GET /api/devotion/today
 * Returns the single server-chosen verse for the current PH day.
 */
app.get("/api/devotion/today", async (_req, res) => {
  try {
    const key = dateKeyPH();

    // Find existing verse-of-the-day
    let doc = await DevotionVerse.findOne({ dateKey: key }).lean();
    if (!doc) {
      // Create once for the day
      const verse = await fetchServerVerse();
      const saved = await DevotionVerse.create({ dateKey: key, ...verse });
      doc = saved.toObject();
    }

    res.json({
      key: doc.dateKey,
      text: doc.text,
      reference: doc.reference,
      translation: doc.translation,
      source: doc.source,
    });
  } catch (e) {
    console.error("GET /api/devotion/today error:", e);
    // Safe fallback so UI still renders something
    res.json({
      key: dateKeyPH(),
      text: "For God so loved the world, that he gave his only begotten Son...",
      reference: "John 3:16",
      translation: "KJV",
      source: "fallback",
    });
  }
});

const DEFAULT_PROMPTS = [
  "How does Philippians 4:13 resonate with your current life challenges?",
  "What specific areas of your life do you need Christ’s strength today?",
  "How can you practically apply this verse to overcome a difficulty this week?",
  "Consider a time when you felt God’s strength. How can you carry that experience forward?",
];

const DevotionPromptsSchema = new mongoose.Schema(
  {
    dateKey: { type: String, index: true }, // "YYYY-MM-DD" (Asia/Manila)
    churchRef: { type: mongoose.Schema.Types.ObjectId, ref: "ChurchApplication", index: true },
    items: { type: [String], default: [] },
  },
  { timestamps: true }
);
DevotionPromptsSchema.index({ dateKey: 1, churchRef: 1 }, { unique: true });
const DevotionPrompts = mongoose.model("DevotionPrompts", DevotionPromptsSchema);

function dateKeyPH() {
  const fmt = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Manila",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
  return fmt.format(new Date());
}

app.get("/api/devotion/prompts/today", auth, async (req, res) => {
  try {
    const { churchId } = req.query;
    if (!churchId) return res.status(400).json({ message: "Missing churchId" });
    const key = dateKeyPH();

    const doc = await DevotionPrompt.findOne({ churchRef: churchId, dateKey: key }).lean();
    res.json({ key, items: doc?.items?.length ? doc.items : DEFAULT_PROMPTS });
  } catch (e) {
    console.error("GET prompts error:", e);
    res.status(500).json({ message: "Server error" });
  }
});

// PUT today prompts (admins only)
app.put("/api/devotion/prompts/today", auth, async (req, res) => {
  try {
    const { churchId, items } = req.body;
    if (!churchId) return res.status(400).json({ message: "Missing churchId" });
    if (!Array.isArray(items)) return res.status(400).json({ message: "items must be array" });

    // simple guard: only church-admins can edit
    if (req.user.role !== "church-admin" && req.user.role !== "superadmin") {
      return res.status(403).json({ message: "Forbidden" });
    }

    const key = dateKeyPH();
    const clean = items.map(s => String(s ?? "").trim()).filter(Boolean);
    const doc = await DevotionPrompt.findOneAndUpdate(
      { churchRef: churchId, dateKey: key },
      { $set: { items: clean } },
      { new: true, upsert: true }
    ).lean();

    // push realtime update
    const io = req.app.get("io");
    io.to(`church:${churchId}`).emit("devotion:prompts:update", { key, items: doc.items });

    res.json({ key, items: doc.items });
  } catch (e) {
    console.error("PUT prompts error:", e);
    res.status(500).json({ message: "Server error" });
  }
});


app.get("/api/church-admin/me/church", auth, async (req, res) => {
  try {
    const appDoc = await ChurchApplication.findOne({ email: req.user.email.toLowerCase() }).lean();
    if (!appDoc) return res.json({ church: null });
    res.json({ church: { id: String(appDoc._id), name: appDoc.churchName, joinCode: appDoc.joinCode || null }});
  } catch (e) { res.status(500).json({ message: "Server error" }); }
});


app.patch("/api/church-admin/members/:id/status", auth, async (req, res) => {
  try {
    const { status } = req.body;
    if (!["active", "inactive"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const member = await User.findById(req.params.id);
    if (!member || member.role !== "member") return res.status(404).json({ message: "Member not found" });

    // only same-church admin (or superadmin) can edit
    if (req.user.role !== "superadmin") {
      const adminChurch = await ChurchApplication.findOne({ email: req.user.email.toLowerCase() }).lean();
      if (!adminChurch) return res.status(403).json({ message: "Forbidden" });
      if (String(member.churchRef) !== String(adminChurch._id)) {
        return res.status(403).json({ message: "Forbidden" });
      }
    }

    member.status = status;
    await member.save();

    res.json({ ok: true, user: { id: String(member._id), status: member.status } });
  } catch (e) {
    console.error("PATCH status error:", e);
    res.status(500).json({ message: "Server error" });
  }
});

app.get("/api/church-admin/mine", auth, async (req, res) => {
  try {
    const appDoc = await ChurchApplication.findOne({ email: req.user.email.toLowerCase() }).lean();
    if (!appDoc) return res.status(404).json({ message: "No church application found" });
    res.json({ id: String(appDoc._id), name: appDoc.churchName, joinCode: appDoc.joinCode || null });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Server error" });
  }
});

// === Per-church stats used by dashboard ===
app.get("/api/church-admin/applications/:id/stats", auth, async (req, res) => {
  try {
    const id = req.params.id;
    const app = await ChurchApplication.findById(id).lean();
    if (!app) return res.status(404).json({ message: "Church not found" });

    if (req.user.role !== "superadmin") {
      const mine = await ChurchApplication.findOne({ email: req.user.email.toLowerCase() }).lean();
      if (!mine || String(mine._id) !== String(id)) return res.status(403).json({ message: "Forbidden" });
    }

    const totalParishioners = await User.countDocuments({ role: "member", churchRef: id });
    const activeMembers     = await User.countDocuments({ role: "member", churchRef: id, status: "active" });
    const inactiveMembers   = totalParishioners - activeMembers;

    res.json({
      churchName: app.churchName || "",
      joinCode: app.joinCode || null,
      totalParishioners,
      activeMembers,
      inactiveMembers,
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Server error" });
  }
});




start();
