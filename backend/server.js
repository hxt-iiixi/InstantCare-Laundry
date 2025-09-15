import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// ------------ Models ------------
const ServiceSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: String,
  pricePerKg: Number,
});
const Service = mongoose.model("Service", ServiceSchema);

const OrderSchema = new mongoose.Schema(
  {
    customerName: { type: String, required: true },
    phone: { type: String, required: true },
    address: { type: String, required: true },
    serviceId: { type: mongoose.Schema.Types.ObjectId, ref: "Service", required: true },
    pickupDate: { type: Date, required: true },
    notes: String,
    status: {
      type: String,
      enum: ["pending", "picked-up", "in-process", "ready", "delivered"],
      default: "pending",
    },
  },
  { timestamps: true }
);
const Order = mongoose.model("Order", OrderSchema);

// ------------ Routes ------------
app.get("/api/health", (_req, res) => res.json({ ok: true }));

// Services
app.get("/api/services", async (_req, res) => {
  const items = await Service.find().lean();
  res.json(items);
});

app.post("/api/services", async (req, res) => {
  try {
    const s = await Service.create(req.body);
    res.status(201).json(s);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

// Orders
app.get("/api/orders", async (_req, res) => {
  const items = await Order.find().populate("serviceId").lean();
  res.json(items);
});

app.post("/api/orders", async (req, res) => {
  try {
    const o = await Order.create(req.body);
    res.status(201).json(o);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

// ------------ Start ------------
const PORT = process.env.PORT || 4000;
async function start() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ MongoDB connected");
    app.listen(PORT, () =>
      console.log(`✅ API running on http://localhost:${PORT}`)
    );
  } catch (err) {
    console.error("❌ Mongo connect failed:", err.message);
    process.exit(1);
  }
}
start();
