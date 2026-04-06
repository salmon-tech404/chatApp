import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    // Message thuộc về conversation nào
    conversationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Conversation",
      required: true,
      index: true, // Tạo index để tối ưu truy vấn theo conversationId
    },
    // Ai gửi message
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    // Nội dung và loại message (text, image, file,...)
    content: {
      type: String,
      required: true,
      trim: true,
    },
    type: {
      type: String,
      enum: ["text", "image", "file"],
      default: "text",
    },
    // Ai đã đọc message
    readBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    // Đã được thu hồi chưa?
    isRevoked: {
      type: Boolean,
      default: false,
    },
  },
  //   Thêm timestamps để tự động quản lý createdAt và updatedAt
  { timestamps: true },
);

messageSchema.index({ consersationId: 1, createdAt: -1 }); // Tạo compound index để tối ưu truy vấn theo conversationId và sắp xếp theo thời gian

const Message = mongoose.model("Message", messageSchema);
export default Message;
