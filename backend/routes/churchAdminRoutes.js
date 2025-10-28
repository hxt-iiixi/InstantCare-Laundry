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
  getMyChurch, 
} from "../controllers/churchAdminController.js";
import auth from "../middleware/auth.js";
import isAdmin from "../middleware/isAdmin.js";
import { generateJoinCode, getChurchStats, getMyChurchApplication } from "../controllers/churchAdminController.js";
import ChurchApplication from "../models/ChurchApplication.js";
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
// church admin (or admin/superadmin) can generate a join code
router.post("/applications/:id/join-code", auth, generateJoinCode);
router.get("/me/church", auth, getMyChurch);

// dashboard KPI: join code + total parishioners
router.get("/applications/:id/stats", auth, getChurchStats);
router.get("/mine", auth, getMyChurchApplication);    

router.get("/applications/:id", auth, async (req, res) => {
  const doc = await ChurchApplication.findById(req.params.id).lean();
  if (!doc) return res.status(404).json({ message: "Not found" });
  res.json({
    _id: String(doc._id),
    churchName: doc.churchName,
    address: doc.address || "",
    email: doc.email || "",
    contactNumber: doc.contactNumber || "",
    status: doc.status,
  });
});




export default router;
