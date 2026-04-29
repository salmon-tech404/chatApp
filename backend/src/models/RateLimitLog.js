import mongoose from "mongoose";

const rateLimitLogSchema = new mongoose.Schema({
  ip: { type: String, required: true },
  userId: { type: String, default: null },
  username: { type: String, default: null },
  route: { type: String, required: true },
  method: { type: String, required: true },
  userAgent: { type: String },
  blockAt: { type: Date, default: Date.now },
  unblockAt: { type: Date, required: true },
  reason: { type: String, required: true },
});

export default mongoose.model("RateLimitLog", rateLimitLogSchema);
