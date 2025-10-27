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
router.get("/", async (req, res) => {
  try {
    const { churchId } = req.query;
    if (!churchId || !mongoose.Types.ObjectId.isValid(churchId)) {
      return res.status(400).json({ message: "Invalid or missing churchId" });
    }
    const events = await Event.find({ churchRef: churchId }).sort({ date: 1 }).lean();
    res.json(events);
  } catch (error) {
    console.error("Error fetching events:", error);
    res.status(500).json({ message: "Server error" });
  }
});

/**
 * Update event
 * PATCH /api/events/:id
 */
router.patch("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({ message: "Invalid id" });

    const payload = { ...req.body };
    if (payload.date) {
      const d = new Date(payload.date);
      if (isNaN(d.getTime())) return res.status(400).json({ message: "Invalid date" });
      payload.date = d;
    }

    const updated = await Event.findByIdAndUpdate(id, payload, { new: true, runValidators: true });
    if (!updated) return res.status(404).json({ message: "Event not found" });
    res.json(updated);
  } catch (error) {
    console.error("Error updating event:", error);
    res.status(500).json({ message: "Server error" });
  }
});

/**
 * Delete event
 * DELETE /api/events/:id
 */
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({ message: "Invalid id" });

    const removed = await Event.findByIdAndDelete(id);
    if (!removed) return res.status(404).json({ message: "Event not found" });
    res.json({ ok: true });
  } catch (error) {
    console.error("Error deleting event:", error);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
