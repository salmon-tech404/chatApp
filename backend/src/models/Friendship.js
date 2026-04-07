import mongoose from "mongoose";

// Tạo schema cho Friendship
const friendshipSchema = new mongoose.Schema(
  {
    requesterId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    recipientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "accepted", "rejected"],
      default: "pending",
    },
  },
  { timestamps: true },
);

// Tránh duplicate friend requests
friendshipSchema.index({ requesterId: 1, recipientId: 1 }, { unique: true });

export default mongoose.model("Friendship", friendshipSchema);
