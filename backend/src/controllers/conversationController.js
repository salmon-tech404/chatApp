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
    res.status(500).json({ message: "Lỗi server" });
  }
};

export const createConversation = async (req, res) => {
  try {
    // Kiểm tra dữ liệu đầu vào
    const userId = req.user._id;
    const { participantId, type = "direct", name } = req.body;

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
    res.status(500).json({ message: "Lỗi server" });
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
  } catch (error) {}
};

export const sendMessage = async (req, res) => {
  try {
    const userId = req.user._id;
    const { id: conversationId } = req.params;
    const { content, type = "text" } = req.body;

    // Kiểm tra xem user có tham gia conversation này không
    if (!content) {
      return res
        .status(400)
        .json({ message: "Nội dung tin nhắn không được để trống" });
    }

    const conversation = await Conversation.findOne({
      _id: conversationId,
      participants: userId,
    });

    if (!conversation) {
      return res.status(403).json({
        message: "Bạn không có quyền gửi tin nhắn vào cuộc trò chuyện này",
      });
    }
    // Tạo tin nhắn mới
    const newMessage = await Message.create({
      conversationId,
      senderId: userId,
      content,
      type,
      readBy: [userId], // Đánh dấu là đã đọc bởi người gửi
    });

    await Conversation.findByIdAndUpdate(conversationId, {
      lastMessage: newMessage._id,
      lastMessageAt: newMessage.createdAt,
    });

    const populatedMessage = await newMessage.populate(
      "senderId",
      "username displayName avatarUrl",
    );

    return res.status(201).json(populatedMessage);
  } catch (error) {
    console.error("Lỗi sendMessage:", error);
    res.status(500).json({ message: "Lỗi server" });
  }
};
