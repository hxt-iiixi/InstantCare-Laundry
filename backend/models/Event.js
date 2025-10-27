import mongoose from 'mongoose';

const eventSchema = new mongoose.Schema({
  title: { type: String, required: true },
  time: { type: String, required: true },
  location: { type: String, required: true },
  description: { type: String, required: true },
  date: { type: Date, required: true },  // Store event date
  churchRef: { type: mongoose.Schema.Types.ObjectId, ref: "ChurchApplication", required: true },  // Link to church
}, { timestamps: true });

export default mongoose.model("Event", eventSchema);
