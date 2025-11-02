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

    // store application
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
        password: hash,
        role: "church-admin",
        isVerified: false,
        regOTP: otp,
        regOTPExpiry: expiry,
      });
    } else {
      if (!["admin", "superadmin"].includes(user.role)) {
        user.role = "church-admin";
      }
      if (!user.password) user.password = hash; // don't overwrite existing password
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

// unique 6-char join code (no O/0/I/1)
async function generateUniqueJoinCode() {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  const makeCode = () => Array.from({ length: 6 }, () => alphabet[crypto.randomInt(alphabet.length)]).join("");
  for (let i = 0; i < 5; i++) {
    const code = makeCode();
    const clash = await ChurchApplication.findOne({ joinCode: code }).lean();
    if (!clash) return code;
  }
  throw new Error("Failed to generate join code");
}

export const approveApplication = async (req, res) => {
  try {
    const id = req.params.id;
    const app = await ChurchApplication.findById(id).lean();
    if (!app) return res.status(404).json({ message: "Not found" });

    if (app.status === "approved") {
      return res.json({ message: "Already approved.", joinCode: app.joinCode || null });
    }

    // upsert/ensure church-admin user
    let newTempPass = null;
    let user = await User.findOne({ email: app.email.toLowerCase() });
    if (user) {
      user.role = "church-admin";
      await user.save();
    } else {
      newTempPass = generateTempPassword(10);
      const hash = await bcrypt.hash(newTempPass, 12);
      user = await User.create({
        email: app.email.toLowerCase(),
        username: app.churchName,
        name: app.churchName,
        password: hash,
        role: "church-admin",
      });
    }

    // ensure joinCode (computed here; saved via atomic update)
    const update = {
      status: "approved",
      notes: String(req.body?.notes || "").trim(),
      reviewedBy: req.user?._id,
    };
    if (!app.joinCode) {
      try {
        update.joinCode = await generateUniqueJoinCode();
        update.joinCodeGeneratedAt = new Date();
      } catch (e) {
        console.warn("Join code generation warning:", e.message);
      }
    }

    const updated = await ChurchApplication.findByIdAndUpdate(
      id,
      { $set: update },
      { new: true, runValidators: false } // ⬅️ avoid re-validating unrelated required fields
    ).lean();

    // send approval email
    try {
      const to = String(app.email || "").toLowerCase().trim();
      if (to) {
        const lines = [
          `Hello ${app.churchName || "there"},`,
          ``,
          `Your AmPower church application has been APPROVED 🎉`,
          (updated?.joinCode || app.joinCode) ? `Join Code: ${updated?.joinCode || app.joinCode}` : "",
          newTempPass ? `Temporary Password: ${newTempPass}` : "",
          newTempPass
            ? `Use your email (${to}) and the temporary password above to sign in, then change it in your profile.`
            : `You can now sign in. If you forgot your password, use "Forgot Password" to reset.`,
          ``,
          `You may invite members using the join code in your church profile at any time.`,
          ``,
          `— AmPower Team`,
        ].filter(Boolean);
        await sendOTPEmail(to, lines.join("\n"));
      }
    } catch (mailErr) {
      console.warn("Approval email send failed:", mailErr?.message || mailErr);
    }

    return res.json({
      message: "Approved",
      userId: user._id,
      joinCode: updated?.joinCode || app.joinCode || null,
    });
  } catch (e) {
    console.error("approveApplication error:", e);
    return res.status(500).json({ message: "Server error" });
  }
};

export const rejectApplication = async (req, res) => {
  try {
    const id = req.params.id;
    const app = await ChurchApplication.findById(id).lean();
    if (!app) return res.status(404).json({ message: "Not found" });

    const { reason = "", notes = "" } = req.body || {};
    const combinedNotes = [notes, reason].map(s => String(s || "").trim()).filter(Boolean).join("\n");

    // atomic update without triggering validators on other fields
    await ChurchApplication.findByIdAndUpdate(
      id,
      { $set: { status: "rejected", notes: combinedNotes, reviewedBy: req.user?._id } },
      { runValidators: false }
    );

    // notify via email
    try {
      const to = String(app.email || "").toLowerCase().trim();
      if (to) {
        const lines = [
          `Hello ${app.churchName || "there"},`,
          ``,
          `Thank you for applying to AmPower.`,
          `We’re sorry to inform you that your application was not approved at this time.`,
          reason ? `` : "",
          reason ? `Reason: ${reason}` : "",
          ``,
          `If you believe this was a mistake or you would like to re-apply, please reply to this email.`,
          ``,
          `— AmPower Team`,
        ].filter(Boolean);
        await sendOTPEmail(to, lines.join("\n"));
      }
    } catch (mailErr) {
      console.warn("Rejection email send failed:", mailErr?.message || mailErr);
    }

    res.json({ message: "Rejected" });
  } catch (e) {
    console.error("rejectApplication error:", e);
    return res.status(500).json({ message: "Server error" });
  }
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
  try {
    const id = req.params.id;
    const app = await ChurchApplication.findById(id).lean();
    if (!app) return res.status(404).json({ message: "Not found" });
    if (app.status !== "approved") {
      return res.status(400).json({ message: "Church must be approved first." });
    }
    if (!canManageChurch(req, app)) {
      return res.status(403).json({ message: "Not allowed." });
    }

    if (app.joinCode) {
      return res.json({
        joinCode: app.joinCode,
        generatedAt: app.joinCodeGeneratedAt,
        alreadyExists: true,
      });
    }

    const code = await generateUniqueJoinCode();
    const now = new Date();

    const updated = await ChurchApplication.findByIdAndUpdate(
      id,
      { $set: { joinCode: code, joinCodeGeneratedAt: now } },
      { new: true, runValidators: false }
    ).lean();

    res.json({
      joinCode: updated.joinCode,
      generatedAt: updated.joinCodeGeneratedAt,
      alreadyExists: false,
    });
  } catch (e) {
    console.error("generateJoinCode error:", e);
    res.status(500).json({ message: "Server error" });
  }
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
    isVerified: true,
  });

  res.json({
    churchName: app.churchName,
    joinCode: app.joinCode || null,
    totalParishioners,
  });
};

export const getMyChurchApplication = async (req, res) => {
  const email = req.user?.email?.toLowerCase();
  if (!email) return res.status(401).json({ message: "Unauthorized" });

  const app = await ChurchApplication.findOne({ email }).lean();
  if (!app) return res.status(404).json({ message: "No application found for this account." });

  res.json({ id: app._id, churchName: app.churchName, status: app.status, joinCode: app.joinCode || null });
};
