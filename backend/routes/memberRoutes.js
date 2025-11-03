// backend/routes/memberRoutes.js
import express from "express";
import auth from "../middleware/auth.js";
import { sendMemberContact } from "../controllers/memberController.js";

import multer from "multer";
import path from "path";
import fs from "fs";
import User from "../models/User.js";

const router = express.Router();

/* -------------------------- avatar upload setup -------------------------- */
const AVATAR_DIR = path.resolve("uploads/avatars");
fs.mkdirSync(AVATAR_DIR, { recursive: true });

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, AVATAR_DIR),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, `${req.user._id}-${Date.now()}${ext}`);
  },
});
const fileFilter = (_req, file, cb) => {
  const ok = [".jpg", ".jpeg", ".png", ".webp", ".gif"].includes(
    path.extname(file.originalname).toLowerCase()
  );
  cb(ok ? null : new Error("Only JPG/PNG/WEBP/GIF allowed"), ok);
};
const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
});

/* ------------------------------ Member profile ------------------------------ */
// GET /api/members/me/profile
router.get("/me/profile", auth, async (req, res) => {
  const user = await User.findById(req.user._id).select("username name email role avatar");
  return res.json({ user });
});

// POST /api/members/me/avatar  (field name: "file")
router.post("/me/avatar", auth, upload.single("file"), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: "No file uploaded" });
    const url = `${req.protocol}://${req.get("host")}/uploads/avatars/${req.file.filename}`;
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { avatar: url },
      { new: true, select: "username name email role avatar" }
    );
    return res.json({ url, user });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Upload failed" });
  }
});

/* ------------------------------- Contact email ------------------------------ */
// POST /api/members/contact  -> sends email to the church admin
router.post("/contact", auth, sendMemberContact);

export default router;
