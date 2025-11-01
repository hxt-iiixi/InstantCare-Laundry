// backend/controllers/churchAdminController.js
import ChurchApplication from "../models/ChurchApplication.js";
import User from "../models/User.js";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import { sendOTPEmail } from "../utils/mailer.js"; 

export const registerChurchAdmin = async (req, res) => {
  try {
    const {
      churchName,
      address,
      email,
      contactNumber,
      password,
      confirmPassword,
    } = req.body;

    if (!churchName || !address || !email || !contactNumber) {
      return res.status(400).json({ message: "All fields are required." });
    }
    if (!req.file) {
      return res.status(400).json({ message: "Church certificate is required." });
    }
    if (!password || !confirmPassword) {
      return res.status(400).json({ message: "Password and confirmation are required." });
    }
    if (password.length < 8) {
      return res.status(400).json({ message: "Password must be at least 8 characters." });
    }
    if (password !== confirmPassword) {
      return res.status(400).json({ message: "Passwords do not match." });
    }

    const normalizedEmail = email.toLowerCase().trim();

    // prevent duplicate pending/approved apps
    const existingApp = await ChurchApplication.findOne({
      email: normalizedEmail,
      status: { $in: ["pending", "approved"] },
    });
    if (existingApp) {
      return res.status(400).json({ message: "An application with this email already exists." });
    }

    // store application (note: saved path uses /uploads/certificates)
    const appDoc = await ChurchApplication.create({
      churchName,
      address,
      email: normalizedEmail,
      contactNumber,
      certificatePath: `/uploads/certificates/${req.file.filename}`,
      status: "pending",
    });

    // issue OTP for email verification
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiry = new Date(Date.now() + 10 * 60 * 1000);

    // upsert user with hashed password
    const hash = await bcrypt.hash(password, 12);
    let user = await User.findOne({ email: normalizedEmail });

    if (!user) {
      user = await User.create({
        email: normalizedEmail,
        username: churchName,
        name: churchName,
        password: hash,          // ⬅️ store password
        role: "church-admin",
        isVerified: false,
        regOTP: otp,
        regOTPExpiry: expiry,
      });
    } else {
      // if user exists (e.g., Google-linked), set role + set password if missing
      if (!["admin", "superadmin"].includes(user.role)) {
        user.role = "church-admin";
      }
      if (!user.password) user.password = hash; // don't overwrite an existing password
      user.isVerified = false;
      user.regOTP = otp;
      user.regOTPExpiry = expiry;
      await user.save();
    }

    try {
      await sendOTPEmail(normalizedEmail, `Your AmPower verification code is: ${otp}`);
    } catch (e) {
      console.warn("Failed to send registration OTP:", e.message);
      // continue; user can request resend
    }

    return res.status(201).json({
      message: "Application submitted. A verification code was sent to your email.",
      id: appDoc._id,
    });
  } catch (err) {
    console.error("registerChurchAdmin:", err);
    res.status(500).json({ message: "Server error" });
  }
};

export const getMyChurch = async (req, res) => {
  try {
    const email = (req.user?.email || "").toLowerCase();
    if (!email) return res.status(401).json({ message: "Unauthorized" });

    const appDoc = await ChurchApplication.findOne({ email }).lean();
    if (!appDoc) return res.json({ church: null });

    res.json({ church: { id: String(appDoc._id), name: appDoc.churchName } });
  } catch (e) {
    console.error("GET /me/church error:", e.message);
    res.status(500).json({ message: "Server error" });
  }
};

export const listApplications = async (req, res) => {
  const { status } = req.query; 
  const q = status ? { status } : {};
  const items = await ChurchApplication.find(q).sort({ createdAt: -1 }).lean();
  res.json(items);
};

export const getApplication = async (req, res) => {
  const item = await ChurchApplication.findById(req.params.id).lean();
  if (!item) return res.status(404).json({ message: "Not found" });
  res.json(item);
};


function generateTempPassword(len = 8) {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789";
  return Array.from({ length: len }, () => alphabet[crypto.randomInt(alphabet.length)]).join("");
}

export const approveApplication = async (req, res) => {
  const app = await ChurchApplication.findById(req.params.id);
  if (!app) return res.status(404).json({ message: "Not found" });
  if (app.status === "approved") return res.json({ message: "Already approved." });

  let user = await User.findOne({ email: app.email.toLowerCase() });
  if (user) {
    // ensure role but DO NOT overwrite an existing password
    user.role = "church-admin";
    await user.save();
  } else {
    const tempPass = generateTempPassword(10);
    const hash = await bcrypt.hash(tempPass, 12);
    user = await User.create({
      email: app.email.toLowerCase(),
      username: app.churchName,
      name: app.churchName,
      password: hash,
      role: "church-admin",
    });
    try {
      await sendOTPEmail(app.email, `Your temporary password: ${tempPass}\nPlease log in and change it.`);
    } catch (e) {
      console.warn("Email send failed (temp pass):", e.message);
    }
  }

  app.status = "approved";
  app.notes = (req.body?.notes || "").trim();
  app.reviewedBy = req.user?._id;
  await app.save();

  res.json({ message: "Approved", userId: user._id });
};

export const rejectApplication = async (req, res) => {
  const app = await ChurchApplication.findById(req.params.id);
  if (!app) return res.status(404).json({ message: "Not found" });
  app.status = "rejected";
  app.notes = (req.body?.notes || "").trim();
  app.reviewedBy = req.user?._id;
  await app.save();
  res.json({ message: "Rejected" });
};
function canManageChurch(req, appDoc) {
  if (!appDoc) return false;
  const isAdmin = ["admin", "superadmin"].includes(req.user?.role);
  const isOwner =
    req.user?.role === "church-admin" &&
    req.user?.email?.toLowerCase() === appDoc.email?.toLowerCase();
  return isAdmin || isOwner;
}

export const generateJoinCode = async (req, res) => {
  const app = await ChurchApplication.findById(req.params.id);
  if (!app) return res.status(404).json({ message: "Not found" });
  if (app.status !== "approved") {
    return res.status(400).json({ message: "Church must be approved first." });
  }
  if (!canManageChurch(req, app)) {
    return res.status(403).json({ message: "Not allowed." });
  }

  // ✅ If a code already exists, DO NOT change it. Return the same code every time.
  if (app.joinCode) {
    return res.json({
      joinCode: app.joinCode,
      generatedAt: app.joinCodeGeneratedAt,
      alreadyExists: true,
    });
  }

  // Otherwise generate once
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // no O/0/I/1
  const makeCode = () =>
    Array.from({ length: 6 }, () => alphabet[crypto.randomInt(alphabet.length)]).join("");

  let code = null;
  for (let i = 0; i < 5; i++) {
    const tryCode = makeCode();
    const clash = await ChurchApplication.findOne({ joinCode: tryCode }).lean();
    if (!clash) { code = tryCode; break; }
  }
  if (!code) return res.status(500).json({ message: "Failed to generate code. Try again." });

  app.joinCode = code;
  app.joinCodeGeneratedAt = new Date();
  await app.save();

  res.json({ joinCode: app.joinCode, generatedAt: app.joinCodeGeneratedAt, alreadyExists: false });
};

export const getChurchStats = async (req, res) => {
  const app = await ChurchApplication.findById(req.params.id);
  if (!app) return res.status(404).json({ message: "Not found" });
  if (!canManageChurch(req, app)) {
    return res.status(403).json({ message: "Not allowed." });
  }

  const totalParishioners = await User.countDocuments({
    churchRef: app._id,
    role: "member",
    isVerified: true, // count verified members only
  });

  res.json({
    churchName: app.churchName,
    joinCode: app.joinCode || null,
    totalParishioners,
  });
};

export const getMyChurchApplication = async (req, res) => {
  // church-admin’s email == ChurchApplication.email (your flow)
  const email = req.user?.email?.toLowerCase();
  if (!email) return res.status(401).json({ message: "Unauthorized" });

  const app = await ChurchApplication.findOne({ email }).lean();
  if (!app) return res.status(404).json({ message: "No application found for this account." });

  res.json({ id: app._id, churchName: app.churchName, status: app.status, joinCode: app.joinCode || null });
};

