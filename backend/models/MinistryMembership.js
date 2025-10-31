import mongoose from "mongoose";

export const MINISTRY_LIST = ["music","youth","education","community","outreach"];

const MinistryMembershipSchema = new mongoose.Schema({
  churchRef: { type: mongoose.Schema.Types.ObjectId, ref: "ChurchApplication", index: true, required: true },
  memberRef: { type: mongoose.Schema.Types.ObjectId, ref: "User", index: true, required: true },
  ministry:  { type: String, enum: MINISTRY_LIST, index: true, required: true },
  status:    { type: String, enum: ["pending","approved","rejected","leave-pending","removed"], default: "pending", index: true },
}, { timestamps: true });

MinistryMembershipSchema.index({ churchRef: 1, memberRef: 1, ministry: 1 }, { unique: true });

export default mongoose.model("MinistryMembership", MinistryMembershipSchema);
