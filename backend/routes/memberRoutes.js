// backend/routes/memberRoutes.js
import express from "express";
import auth from "../middleware/auth.js";
import { sendMemberContact } from "../controllers/memberController.js";

const router = express.Router();

// POST /api/members/contact  -> sends email to the church admin
router.post("/contact", auth, sendMemberContact);

export default router;
