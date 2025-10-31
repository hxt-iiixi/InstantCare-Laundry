import express from "express";
import auth from "../middleware/auth.js";
import User from "../models/User.js";
import ChurchApplication from "../models/ChurchApplication.js";
import MinistryMembership, { MINISTRY_LIST } from "../models/MinistryMembership.js";

const router = express.Router();

// My ministries (for current member)
router.get("/my", auth, async (req, res) => {
  const me = await User.findById(req.user._id).lean();
  if (!me?.churchRef) return res.json({ churchId: null, items: [] });
  const items = await MinistryMembership.find({ churchRef: me.churchRef, memberRef: me._id }).sort({ createdAt: -1 }).lean();
  res.json({ churchId: String(me.churchRef), items: items.map(d => ({ id: String(d._id), ministry: d.ministry, status: d.status })) });
});

// Request join
router.post("/join", auth, async (req, res) => {
  const { ministry } = req.body || {};
  if (!MINISTRY_LIST.includes(ministry)) return res.status(400).json({ message: "Invalid ministry" });
  const me = await User.findById(req.user._id).lean();
  if (!me?.churchRef) return res.status(400).json({ message: "Join a church first." });

  const doc = await MinistryMembership.findOneAndUpdate(
    { churchRef: me.churchRef, memberRef: me._id, ministry },
    { $setOnInsert: { churchRef: me.churchRef, memberRef: me._id, ministry }, $set: { status: "pending" } },
    { new: true, upsert: true }
  );
  res.json({ id: String(doc._id), ministry: doc.ministry, status: doc.status });
});

// Request leave
router.post("/leave", auth, async (req, res) => {
  const { ministry } = req.body || {};
  const me = await User.findById(req.user._id).lean();
  if (!me?.churchRef) return res.status(400).json({ message: "No church" });
  const doc = await MinistryMembership.findOne({ churchRef: me.churchRef, memberRef: me._id, ministry });
  if (!doc) return res.status(404).json({ message: "Not a member of this ministry" });
  if (doc.status === "approved") { doc.status = "leave-pending"; await doc.save(); }
  res.json({ id: String(doc._id), ministry: doc.ministry, status: doc.status });
});

// Approved roster per ministry
router.get("/roster", auth, async (req, res) => {
  let { churchId } = req.query;
  if (req.user.role === "member") {
    const me = await User.findById(req.user._id).lean();
    churchId = me?.churchRef ? String(me.churchRef) : null;
  }
  if (!churchId) return res.status(400).json({ message: "Missing churchId" });

  const rows = await MinistryMembership.find({ churchRef: churchId, status: "approved" })
    .populate({ path: "memberRef", select: "name username email avatar" })
    .lean();

  const roster = { music:[], youth:[], education:[], community:[], outreach:[] };
  rows.forEach(r => {
    roster[r.ministry].push({
      id: String(r._id),
      userId: String(r.memberRef?._id || r.memberId),
      name: r.memberRef?.name || r.memberRef?.username || "Member",
      avatar: r.memberRef?.avatar || "",
      email: r.memberRef?.email || ""
    });
  });
  res.json({ churchId, roster });
});

export default router;
