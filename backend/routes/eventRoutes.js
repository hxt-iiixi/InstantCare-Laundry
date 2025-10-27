import express from "express";
import mongoose from "mongoose";
import Event from "../models/Event.js";
import auth from "../middleware/auth.js";

const router = express.Router();

/**
 * Create an event
 * Body: { title, time, location, description, date, churchRef }
 */
router.post("/", async (req, res) => {
  try {
    let { title, time, location, description, date, churchRef } = req.body;

    // Ensure date is stored as Date
    const jsDate = new Date(date); // accepts 'YYYY-MM-DD'
    if (isNaN(jsDate.getTime())) {
      return res.status(400).json({ message: "Invalid date" });
    }

    // Ensure churchRef is a valid ObjectId
    if (!churchRef || !mongoose.Types.ObjectId.isValid(churchRef)) {
      return res.status(400).json({ message: "Invalid or missing churchRef" });
    }

    const newEvent = await Event.create({
      title,
      time,
      location,
      description,
      date: jsDate,
      churchRef,
    });

    res.status(201).json(newEvent);
  } catch (error) {
    console.error("Error saving event:", error);
    res.status(500).json({ message: "Server error" });
  }
});

/**
 * List events by church
 * GET /api/events?churchId=<id>
 */
router.post("/", async (req, res) => {
  try {
    const { title, time, location, description, date, churchRef } = req.body;
    const newEvent = await Event.create({ title, time, location, description, date, churchRef });

    // broadcast to that church’s room
    const io = req.app.get("io");
    io?.to(`church:${churchRef}`).emit("event:new", newEvent);

    res.status(201).json(newEvent);
  } catch (e) { res.status(500).json({ message: "Server error" }); }
});

/**
 * Update event
 * PATCH /api/events/:id
 */
// Update
router.patch("/:id", async (req, res) => {
  try {
    const ev = await Event.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!ev) return res.status(404).json({ message: "Not found" });

    const io = req.app.get("io");
    io?.to(`church:${ev.churchRef}`).emit("event:updated", ev);

    res.json(ev);
  } catch (e) { res.status(500).json({ message: "Server error" }); }
});

// Delete
router.delete("/:id", async (req, res) => {
  try {
    const ev = await Event.findByIdAndDelete(req.params.id);
    if (!ev) return res.status(404).json({ message: "Not found" });

    const io = req.app.get("io");
    io?.to(`church:${ev.churchRef}`).emit("event:deleted", { id: String(ev._id) });

    res.json({ ok: true });
  } catch (e) { res.status(500).json({ message: "Server error" }); }
});

export default router;
