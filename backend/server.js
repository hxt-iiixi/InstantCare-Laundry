import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
const authRoutes = require('./routes/authRoutes');
dotenv.config();

const app = express();
app.use(cors({
  origin: "http://localhost:5173", // Ensure this matches your frontend's URL
}));
app.use(express.json());

// ------------ User Model ------------
// Move this definition to the top before using the User model
const UserSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
  },
  { timestamps: true }
);

const User = mongoose.model("User", UserSchema); // Ensure the model is defined before routes

// ------------ Services & Orders Models (same as before) ------------

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

app.get("/", (_req, res) => {
  res.send("Welcome to the InstantCare Laundry API! Use /api/health to check status.");
});

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

// ------------ User Routes ------------

// Register a new user
app.post("/api/register", async (req, res) => {
  const { username, email, password } = req.body;

  // Check if user already exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res.status(400).json({ message: "Email is already in use" });
  }

  try {
    // Ensure salt rounds are defined as 12
    const saltRounds = 12;

    // Hash the password with bcrypt and 12 salt rounds
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create new user
    const newUser = new User({ username, email, password: hashedPassword });
    await newUser.save();

    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.error("Error during registration:", error); // Log errors for debugging
    res.status(500).json({ message: "Server error" });
  }
});

// Login route
app.post("/api/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find the user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Check if password matches
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Generate JWT token
    const token = jwt.sign({ id: user._id }, "yourSecretKey", { expiresIn: "1h" });

    res.json({ token, user: { username: user.username, email: user.email } });
  } catch (error) {
    console.error(error); // Log errors to the console for better debugging
    res.status(500).json({ message: "Server error" });
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
