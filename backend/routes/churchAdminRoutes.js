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
import MinistryMembership from "../models/MinistryMembership.js";
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
router.get("/ministries/requests", auth, async (req, res) => {
  let { churchId, status } = req.query;
  if (req.user.role !== "superadmin") {
    const mine = await ChurchApplication.findOne({ email: req.user.email.toLowerCase() }).lean();
    if (!mine) return res.status(403).json({ message: "Forbidden" });
    churchId = churchId || String(mine._id);
    if (String(churchId) !== String(mine._id)) return res.status(403).json({ message: "Forbidden" });
  }
  if (!churchId) return res.status(400).json({ message: "Missing churchId" });

  const filter = { churchRef: churchId };
  if (status && status !== "all") filter.status = status;

  const rows = await MinistryMembership.find(filter)
    .populate({ path: "memberRef", select: "name username email avatar" })
    .sort({ createdAt: -1 })
    .lean();

  const items = rows.map(r => ({
    id: String(r._id),
    ministry: r.ministry,
    status: r.status,
    requestType: r.status === "leave-pending" ? "leave" : "join",
    member: {
      id: String(r.memberRef?._id || ""),
      name: r.memberRef?.name || r.memberRef?.username || "Member",
      email: r.memberRef?.email || "",
      avatar: r.memberRef?.avatar || ""
    },
    createdAt: r.createdAt
  }));
  res.json({ churchId, items });
});

router.patch("/ministries/requests/:id", auth, async (req, res) => {
  const { action } = req.body; // approve | reject
  const doc = await MinistryMembership.findById(req.params.id);
  if (!doc) return res.status(404).json({ message: "Request not found" });

  if (req.user.role !== "superadmin") {
    const mine = await ChurchApplication.findOne({ email: req.user.email.toLowerCase() }).lean();
    if (!mine || String(mine._id) !== String(doc.churchRef)) return res.status(403).json({ message: "Forbidden" });
  }

  if (action === "approve") {
    if (doc.status === "pending") doc.status = "approved";
    else if (doc.status === "leave-pending") doc.status = "removed";
  } else if (action === "reject") {
    if (doc.status === "pending") doc.status = "rejected";
    else if (doc.status === "leave-pending") doc.status = "approved";
  } else {
    return res.status(400).json({ message: "Invalid action" });
  }
  await doc.save();
  res.json({ id: String(doc._id), status: doc.status });
});

router.get("/applications/:id/summary", auth, async (req, res) => {
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
