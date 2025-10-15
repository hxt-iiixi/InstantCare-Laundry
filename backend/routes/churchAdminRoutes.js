// backend/routes/churchAdminRoutes.js
import express from "express";
import multer from "multer";
import path from "path";
import crypto from "crypto";
import {
  registerChurchAdmin,
  listApplications,
  getApplication,
  approveApplication,
  rejectApplication,
} from "../controllers/churchAdminController.js";
import auth from "../middleware/auth.js";
import isAdmin from "../middleware/isAdmin.js";

const router = express.Router();
router.get("/ping", (_req, res) => res.json({ ok: true, at: "/api/church-admin/ping" }));

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, "uploads/certificates"),
  filename: (_req, file, cb) => {
    const id = crypto.randomBytes(8).toString("hex");
    const ext = path.extname(file.originalname);
    cb(null, `${id}-${Date.now()}${ext}`);
  },
});
const fileFilter = (_req, file, cb) => {
  const ok = ["image/jpeg", "image/png", "application/pdf"].includes(file.mimetype);
  cb(ok ? null : new Error("Only PDF/JPG/PNG allowed"), ok);
};
const upload = multer({ storage, fileFilter, limits: { fileSize: 10 * 1024 * 1024 } });


router.post("/register", upload.single("certificate"), registerChurchAdmin);


router.get("/applications", auth, isAdmin, listApplications);
router.get("/applications/:id", auth, isAdmin, getApplication);
router.patch("/applications/:id/approve", auth, isAdmin, approveApplication);
router.patch("/applications/:id/reject", auth, isAdmin, rejectApplication);

export default router;
