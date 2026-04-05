import express from "express";

import {
  getConversations,
  createConversation,
  getMessages,
  sendMessage,
} from "../controllers/conversationController.js";

const router = express.Router();

router.get("/", getConversations); // Lấy danh sách cuộc trò chuyện của người dùng
router.post("/", createConversation); // Tạo cuộc trò chuyện mới
router.get("/:conversationId/messages", getMessages); // Lấy tin nhắn của cuộc trò chuyện
router.post("/:conversationId/messages", sendMessage); // Gửi tin nhắn mới trong cuộc trò chuyện

export default router;
