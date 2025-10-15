// backend/controllers/churchAdminController.js
import ChurchApplication from "../models/ChurchApplication.js";
import User from "../models/User.js";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import { sendOTPEmail } from "../utils/mailer.js"; 

export const registerChurchAdmin = async (req, res) => {
  try {
    const { churchName, address, email, contactNumber } = req.body;
    if (!churchName || !address || !email || !contactNumber) {
      return res.status(400).json({ message: "All fields are required." });
    }
    if (!req.file) {
      return res.status(400).json({ message: "Church certificate is required." });
    }

    const normalizedEmail = email.toLowerCase().trim();

  
    const existingApp = await ChurchApplication.findOne({
      email: normalizedEmail,
      status: { $in: ["pending", "approved"] },
    });
    if (existingApp) {
      return res.status(400).json({ message: "An application with this email already exists." });
    }

    // 1) store the application
    const appDoc = await ChurchApplication.create({
      churchName,
      address,
      email: normalizedEmail,
      contactNumber,
      certificatePath: `/uploads/certificates/${req.file.filename}`,
      status: "pending",
    });

    // 2) upsert a User with reg OTP (so verify/resend will find it)
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiry = new Date(Date.now() + 10 * 60 * 1000);

    let user = await User.findOne({ email: normalizedEmail });

    if (!user) {
      user = await User.create({
        email: normalizedEmail,
        username: churchName,
        name: churchName,

        role: "church-admin",
        isVerified: false,
        regOTP: otp,
        regOTPExpiry: expiry,
      });
    } else {

      if (!["admin", "superadmin"].includes(user.role)) {
        user.role = "church-admin";
      }
      user.isVerified = false;
      user.regOTP = otp;
      user.regOTPExpiry = expiry;
      await user.save();
    }


    try {
      await sendOTPEmail(normalizedEmail, `Your AmPower verification code is: ${otp}`);
    } catch (e) {
      console.warn("Failed to send registration OTP:", e.message);
  
    }

    return res
      .status(201)
      .json({ message: "Application submitted. A verification code was sent to your email.", id: appDoc._id });
  } catch (err) {
    console.error("registerChurchAdmin:", err);
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


export const approveApplication = async (req, res) => {
  const app = await ChurchApplication.findById(req.params.id);
  if (!app) return res.status(404).json({ message: "Not found" });
  if (app.status === "approved") return res.json({ message: "Already approved." });


  let user = await User.findOne({ email: app.email.toLowerCase() });
  if (user) {
    user.role = "church-admin";
    await user.save();
  } else {

    const tempPass = crypto.randomBytes(6).toString("12345678"); 
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
