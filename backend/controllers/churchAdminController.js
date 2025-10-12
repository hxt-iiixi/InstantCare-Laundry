// backend/controllers/churchAdminController.js
import ChurchApplication from "../models/ChurchApplication.js";
import User from "../models/User.js";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import { sendOTPEmail } from "../utils/mailer.js"; // you already have this

export const registerChurchAdmin = async (req, res) => {
  try {
    const { churchName, address, email, contactNumber } = req.body;
    if (!churchName || !address || !email || !contactNumber) {
      return res.status(400).json({ message: "All fields are required." });
    }
    if (!req.file) {
      return res.status(400).json({ message: "Church certificate is required." });
    }

    const existing = await ChurchApplication.findOne({ email: email.toLowerCase().trim(), status: { $in: ["pending","approved"] } });
    if (existing) return res.status(400).json({ message: "An application with this email already exists." });

    const appDoc = await ChurchApplication.create({
      churchName,
      address,
      email: email.toLowerCase().trim(),
      contactNumber,
      certificatePath: `/uploads/certificates/${req.file.filename}`,
      status: "pending",
    });

    res.status(201).json({ message: "Application submitted.", id: appDoc._id });
  } catch (err) {
    console.error("registerChurchAdmin:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// List applications (optionally filter by status)
export const listApplications = async (req, res) => {
  const { status } = req.query; // pending|approved|rejected (optional)
  const q = status ? { status } : {};
  const items = await ChurchApplication.find(q).sort({ createdAt: -1 }).lean();
  res.json(items);
};

export const getApplication = async (req, res) => {
  const item = await ChurchApplication.findById(req.params.id).lean();
  if (!item) return res.status(404).json({ message: "Not found" });
  res.json(item);
};

// Approve -> promote existing user or create a new user with temp password
export const approveApplication = async (req, res) => {
  const app = await ChurchApplication.findById(req.params.id);
  if (!app) return res.status(404).json({ message: "Not found" });
  if (app.status === "approved") return res.json({ message: "Already approved." });

  // 1) promote or create
  let user = await User.findOne({ email: app.email.toLowerCase() });
  if (user) {
    user.role = "church-admin";
    await user.save();
  } else {
    // create minimal user + temp password (or issue a reg OTP)
    const tempPass = crypto.randomBytes(6).toString("base64url"); // short temp PW
    const hash = await bcrypt.hash(tempPass, 12);
    user = await User.create({
      email: app.email.toLowerCase(),
      username: app.churchName,
      name: app.churchName,
      password: hash,
      role: "church-admin",
    });

    // email them a set-password/temporary-password notice
    try {
      await sendOTPEmail(app.email, `Your temporary password: ${tempPass}\nPlease log in and change it.`); 
    } catch (e) {
      console.warn("Email send failed (temp pass):", e.message);
    }
  }

  // 2) mark application approved
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
