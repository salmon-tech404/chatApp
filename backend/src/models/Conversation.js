import mongoose from "mongoose";

const ConversationSchema = new mongoose.Schema(
  {
    // người tham gia cuộc trò chuyện
    participants: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
    ],

    // Chat 1 người hay nhóm
    type: {
      type: String,
      enum: ["direct", "group"],
      default: "direct",
    },

    // Tên nhóm
    name: {
      type: String,
      trim: true,
    },

    // Tin nhắn cuối cùng
    lastMessage: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Message",
    },

    // Thời điểm tin nhắn cuối cùng
    lastMessageAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  },
);

// Tối ưu hóa truy vấn để lấy cuộc trò chuyện của người dùng
ConversationSchema.index({ participants: 1, lastMessageAt: -1 });

export default mongoose.model("Conversation", ConversationSchema);
