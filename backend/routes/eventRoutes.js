import express from "express";
import Event from "../models/Event.js";
import auth from "../middleware/auth.js";

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const { title, time, location, description, date, churchRef } = req.body;
    const newEvent = new Event({
      title,
      time,
      location,
      description,
      date,
      churchRef,
    });

    await newEvent.save();
    res.status(201).json(newEvent);
  } catch (error) {
    console.error("Error saving event:", error.message);  // Log the error message
    res.status(500).json({ message: "Server error", error: error.message });
  }
});



export default router;
