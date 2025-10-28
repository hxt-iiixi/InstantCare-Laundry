// routes/eventRoutes.js
import express from "express";
import Event from "../models/Event.js";
import auth from "../middleware/auth.js";
import ChurchApplication from "../models/ChurchApplication.js";

const router = express.Router();

async function getRequesterChurchId(req) {
  // members carry churchRef on their user doc (set at registration)
  if (req.user.role === "member") return req.user.churchRef?.toString() || null;

  // church-admin is linked by application email
  if (req.user.role === "church-admin" || req.user.role === "superadmin") {
    const appDoc = await ChurchApplication
      .findOne({ email: req.user.email.toLowerCase() })
      .lean();
    return appDoc?._id?.toString() || null;
  }
  return null;
}

// GET /api/events?churchId=...
router.get("/", auth, async (req, res) => {
  try {
    const { churchId } = req.query;
    const myChurch = await getRequesterChurchId(req);
    if (!churchId || !myChurch || churchId !== myChurch) {
      return res.status(403).json({ message: "Forbidden" });
    }
    const items = await Event.find({ churchRef: churchId }).sort({ date: 1 }).lean();
    res.json(items);
  } catch (e) {
    res.status(500).json({ message: "Server error" });
  }
});

// CREATE (admins only) – event is always pinned to admin’s church
router.post("/", auth, async (req, res) => {
  try {
    if (req.user.role !== "church-admin" && req.user.role !== "superadmin") {
      return res.status(403).json({ message: "Admins only" });
    }
    const myChurch = await getRequesterChurchId(req);
    if (!myChurch) return res.status(403).json({ message: "Forbidden" });

    const { title, time, location, description, date } = req.body;
    const ev = await Event.create({ title, time, location, description, date, churchRef: myChurch });

    // realtime to that church only
    req.app.get("io").to(`church:${myChurch}`).emit("event:new", ev.toObject());
    res.status(201).json(ev);
  } catch (e) {
    res.status(400).json({ message: e.message });
  }
});

// UPDATE (admins only)
router.put("/:id", auth, async (req, res) => {
  try {
    if (req.user.role !== "church-admin" && req.user.role !== "superadmin") {
      return res.status(403).json({ message: "Admins only" });
    }
    const myChurch = await getRequesterChurchId(req);
    const ev = await Event.findById(req.params.id);
    if (!ev || ev.churchRef.toString() !== myChurch) return res.status(404).json({ message: "Not found" });

    Object.assign(ev, {
      title: req.body.title ?? ev.title,
      time: req.body.time ?? ev.time,
      location: req.body.location ?? ev.location,
      description: req.body.description ?? ev.description,
      date: req.body.date ?? ev.date,
      churchRef: myChurch, // cannot move to another church
    });
    await ev.save();

    req.app.get("io").to(`church:${myChurch}`).emit("event:updated", ev.toObject());
    res.json(ev);
  } catch (e) {
    res.status(400).json({ message: e.message });
  }
});

// DELETE (admins only)
router.delete("/:id", auth, async (req, res) => {
  try {
    if (req.user.role !== "church-admin" && req.user.role !== "superadmin") {
      return res.status(403).json({ message: "Admins only" });
    }
    const myChurch = await getRequesterChurchId(req);
    const ev = await Event.findById(req.params.id).lean();
    if (!ev || ev.churchRef.toString() !== myChurch) return res.status(404).json({ message: "Not found" });

    await Event.findByIdAndDelete(ev._id);
    req.app.get("io").to(`church:${myChurch}`).emit("event:deleted", { id: String(ev._id) });
    res.json({ ok: true });
  } catch (e) {
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
