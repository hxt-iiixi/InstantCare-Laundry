

//ChurchApplication.js
import mongoose from "mongoose";

const churchApplicationSchema = new mongoose.Schema(
  {
    churchName: { type: String, required: true, trim: true },
    address:    { type: String, required: true, trim: true },  // full address
    city:       { type: String, trim: true },
    province:   { type: String, trim: true },

    email:         { type: String, required: true, lowercase: true, trim: true, index: true },
    contactNumber: { type: String, required: true, trim: true },

    certificatePath: { type: String, required: true }, // /uploads/certificates/...

    status:   { type: String, enum: ["pending","approved","rejected"], default: "pending", index: true },
    reviewedBy:{ type: mongoose.Schema.Types.ObjectId, ref: "User" },

    joinCode:            { type: String, unique: true, sparse: true, index: true },
    joinCodeGeneratedAt: { type: Date },

    notes: String,

    // presentation
    bio:    String,
    avatar: String,   // church logo/photo
    cover:  String,   // header/cover
  },
  { timestamps: true }
);

export default mongoose.model("ChurchApplication", churchApplicationSchema);
