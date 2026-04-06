import mongoose from "mongoose";
import Conversation from "../models/Conversation.js";
import Message from "../models/Message.js";

export const getConversations = async (req, res) => {
  try {
    const userId = req.user._id;

    // Tìm tất cả conversations mà user tham gia
    const conversations = await Conversation.find({
      participants: userId,
    })
      .populate("participants", "username displayName avatarUrl")
      .populate("lastMessage")
      .sort({ lastMessageAt: -1 }); // Lấy thông tin người tham gia
    return res.status(200).json(conversations);
  } catch (error) {
    console.error("Lỗi getConversations:", error);
    res.status(500).json({ message: "Lỗi server ở getConversations" });
  }
};

export const createConversation = async (req, res) => {
  try {
    // Kiểm tra dữ liệu đầu vào
    const userId = req.user._id;
    const { participantId, type = "direct", name } = req.body;

    console.log("createConversation - participantId:", participantId);
    console.log("createConversation - type:", type);
    console.log("createConversation - name:", name);

    // Kiểm tra chat direct hay group
    if (!participantId) {
      return res.status(400).json({ message: "Thiếu participantId" });
    }
    // Nếu chưa có chat thì tạo mới
    if (type === "direct") {
      const existingConversation = await Conversation.findOne({
        type: "direct",
        participants: { $all: [userId, participantId] },
      }).populate("participants", "username displayName avatarUrl");
      if (existingConversation) {
        return res.status(200).json(existingConversation);
      }
      // Nếu chưa có thì tạo mới
      const newConversation = await Conversation.create({
        participants:
          type === "direct"
            ? [userId, participantId]
            : [userId, ...req.body.participants],
        name: type === "group" ? name : undefined,
      });
      // Populate thông tin người tham gia và trả về
      const populatedConversation = await newConversation.populate(
        "participants",
        "username displayName avatarUrl",
      );
      return res.status(201).json(populatedConversation);
    }
  } catch (error) {
    console.error("Lỗi createConversation:", error);
    res.status(500).json({ message: "Lỗi server ở createConversation" });
  }
};

export const getMessages = async (req, res) => {
  try {
    const userId = req.user._id;
    const { conversationId } = req.params;

    // Kiểm tra xem user có tham gia conversation này không
    const conversation = await Conversation.findOne({
      _id: conversationId,
      participants: userId,
    });

    if (!conversation) {
      return res
        .status(403)
        .json({ message: "Bạn không có quyền truy cập cuộc trò chuyện này" });
    }

    const messages = await Message.find({ conversationId })
      .populate("senderId", "username, displayName avatarUrl")
      .sort({ createdAt: 1 }); // Sắp xếp theo thời gian tạo (từ cũ đến mới)

    return res.status(200).json(messages);
  } catch (error) {
    console.error("Lỗi getMessages:", error);
    res.status(500).json({ message: "Lỗi server ở getMessages" });
  }
};

export const sendMessage = async (req, res) => {
  try {
    const { conversationId } = req.params;
    const { content, type = "text" } = req.body;
    const userId = req.user._id; // ID từ middleware auth

    // 1. Validation
    if (!content) return res.status(400).json({ message: "Nội dung trống" });

    // 2. Authorization (Xác thực quyền)
    const conversation = await Conversation.findOne({
      _id: conversationId.trim(),
      participants: userId, // Kiểm tra user có trong mảng participants không
    });
    console.log("Id conversation:", conversationId);
    console.log(
      "participants: ",
      conversation ? conversation.participants : "Không tìm thấy conversation",
    );

    if (!conversation) {
      return res
        .status(403)
        .json({ message: "Bạn không có quyền trong chat này" });
    }

    // 3. Create Message
    const newMessage = await Message.create({
      conversationId,
      senderId: userId,
      content,
      type,
      readBy: [userId],
    });

    // 4. Update Conversation (Lưu tin nhắn cuối)
    await Conversation.findByIdAndUpdate(conversationId, {
      lastMessage: newMessage._id,
      lastMessageAt: Date.now(),
    });

    // 5. Response (Trả về kèm thông tin sender để hiển thị)
    const populatedMessage = await newMessage.populate(
      "senderId",
      "username displayName avatarUrl",
    );

    res.status(201).json(populatedMessage);
  } catch (error) {
    res.status(500).json({ message: "Lỗi hệ thống" });
  }
};
