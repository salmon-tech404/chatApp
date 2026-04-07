import express from "express";

import {
  sendFriendRequest,
  respondToFriendRequest,
  cancelFriendRequest,
  getFriends,
  getPendingFriendRequests,
  searchUsers,
  removeFriend,
} from "../controllers/friendController.js";

const router = express.Router();

router.post("/request", sendFriendRequest); // Gửi lời mời kết bạn
router.post("/:friendshipId/respond", respondToFriendRequest); // Phản hồi lời mời kết bạn

router.delete("/cancel", cancelFriendRequest); // Hủy lời mời kết bạn đã gửi

router.get("/list", getFriends); // Lấy danh sách bạn bè của người dùng
router.get("/pending", getPendingFriendRequests); // Lấy danh sách lời mời kết bạn đang chờ phản hồi
router.get("/search", searchUsers); // Tìm kiếm user để gửi lời mời kết bạn

router.delete("/remove/:friendId", removeFriend); // Xóa bạn bè

export default router;
