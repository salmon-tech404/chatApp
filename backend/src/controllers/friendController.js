import Friendship from "../models/Friendship.js";
import User from "../models/User.js";

// Gửi lời mời kết bạn
export const sendFriendRequest = async (req, res) => {
  try {
    const requestedUserId = req.user._id;
    const { recipientId } = req.body;

    // Không thể tự kết bạn
    if (requestedUserId.toString() === recipientId?.toString()) {
      return res
        .status(400)
        .json({ message: "Bạn không thể tự kết bạn với chính mình!" });
    }

    //   Kiểm tra xem recipientId có tồn tại không
    const recipient = await User.findById(recipientId);
    if (!recipient) {
      return res.status(404).json({ message: "Người dùng không tồn tại!" });
    }

    //   Kiểm tra xem mối quan hệ 2 user
    const existingFriendship = await Friendship.findOne({
      // Kiểm tra 2 chiều bằng toán tử or của MongoDB
      $or: [
        { requesterId: requestedUserId, recipientId: recipientId },
        { requesterId: recipientId, recipientId: requestedUserId },
      ],
    });
    if (existingFriendship) {
      if (existingFriendship.status === "accepted") {
        return res.status(409).json({ message: "Hai người đã là bạn bè!" });
      } else if (existingFriendship.status === "pending") {
        return res
          .status(409)
          .json({ message: "Đã có lời mời kết bạn đang chờ phản hồi!" });
      }
    }

    const newFriendship = await Friendship.create({
      requesterId: requestedUserId,
      recipientId: recipientId,
      status: "pending",
    });
    res.status(201).json({
      message: "Lời mời kết bạn đã được gửi!",
      friendship: newFriendship,
    });
  } catch (error) {
    console.error("Lỗi khi gửi lời mời kết bạn:", error);
    res.status(500).json({ message: "Lỗi máy chủ tại sendFriendRequest!" });
  }
};

// Phản hồi lời mời kết bạn (chấp nhận hoặc từ chối)
export const respondToFriendRequest = async (req, res) => {
  const { friendshipId } = req.params;
  const { action } = req.body; // "accept" hoặc "reject"
  const userId = req.user._id;

  try {
    if (["accept", "reject"].includes(action)) {
      const friendship = await Friendship.findById(friendshipId);
      // Kiểm tra lời mời kết bạn có tồn tại không
      if (!friendship) {
        return res
          .status(404)
          .json({ message: "Lời mời kết bạn không tồn tại!" });
      }
      // Kiểm tra xem người dùng có phải là người nhận lời mời không
      if (friendship.recipientId.toString() !== userId.toString()) {
        return res.status(403).json({
          message: "Bạn không có quyền phản hồi lời mời kết bạn này!",
        });
      }
      //   Kiểm tra status của lời mời kết bạn
      if (friendship.status !== "pending") {
        return res
          .status(400)
          .json({ message: "Lời mời kết bạn đã được phản hồi!" });
      }
      // Cập nhật trạng thái lời mời kết bạn
      friendship.status = action === "accept" ? "accepted" : "rejected";
      await friendship.save();

      // Nếu accept thành công, tự động tạo một Conversation (Direct Message) cho 2 người luôn
      if (action === "accept") {
        import("../models/Conversation.js").then(async (module) => {
           const Conversation = module.default;
           const existing = await Conversation.findOne({
              type: "direct",
              participants: { $all: [friendship.requesterId, friendship.recipientId] }
           });
           if (!existing) {
              await Conversation.create({
                 type: "direct",
                 participants: [friendship.requesterId, friendship.recipientId]
              });
           }
        });
      }

      res.json({ message: `Lời mời kết bạn đã được ${action}ed!`, friendship });
    }
  } catch (error) {
    console.error("Lỗi khi phản hồi lời mời kết bạn:", error);
    res
      .status(500)
      .json({ message: "Lỗi máy chủ tại respondToFriendRequest!" });
  }
};

// Hủy lời mời kết bạn đã gửi
export const cancelFriendRequest = async (req, res) => {
  try {
    const requestedUserId = req.user._id;
    const { receiverId } = req.body;

    // Kiểm tra xem mối quan hệ 2 user
    const existingFriendship = await Friendship.findOne({
      $or: [
        { requesterId: requestedUserId, recipientId: receiverId }, // Bạn gửi cho họ
        { requesterId: receiverId, recipientId: requestedUserId }, // Họ gửi cho bạn
      ],
      status: "pending", // Chỉ hủy được khi lời mời đang chờ phản hồi
    });
    if (!existingFriendship) {
      return res.status(404).json({
        message: "Lời mời kết bạn không tồn tại hoặc đã được phản hồi!",
      });
    }
    await Friendship.deleteOne({ _id: existingFriendship._id });
    res.json({ message: "Lời mời kết bạn đã được hủy!" });
  } catch (error) {
    console.error("Lỗi khi hủy lời mời kết bạn:", error);
    res.status(500).json({ message: "Lỗi máy chủ tại cancelFriendRequest!" });
  }
};

// Lấy danh sách bạn bè của người dùng (status = accepted)
export const getFriends = async (req, res) => {
  try {
    const userId = req.user._id;
    const friendships = await Friendship.find({
      $or: [{ requesterId: userId }, { recipientId: userId }],
      status: "accepted",
    }).populate("requesterId recipientId", "username displayName email avatarUrl");

    // Chuyển đổi dữ liệu để trả về danh sách bạn bè (lấy bên kia của friendship)
    const friends = friendships
      .map((friendship) => {
        return friendship.requesterId._id.toString() === userId.toString()
          ? friendship.recipientId
          : friendship.requesterId;
      })
      .filter(Boolean) // loại bỏ null nếu populate thất bại
      .filter((friend) => friend._id.toString() !== userId.toString()); // đảm bảo không trả về chính mình
    res.json({ friends });
  } catch (error) {
    console.error("Lỗi khi lấy danh sách bạn bè:", error);
    res.status(500).json({ message: "Lỗi máy chủ tại getFriends!" });
  }
};

// Lấy danh sách lời mời kết bạn đang chờ phản hồi (status = pending)
export const getPendingFriendRequests = async (req, res) => {
  try {
    const userId = req.user._id;

    // Lấy những lời mời mà mình là người nhận (recipientId)
    const requests = await Friendship.find({
      recipientId: userId,
      status: "pending",
    }).populate("requesterId", "username email avatar");

    res.status(200).json(requests);
  } catch (error) {
    console.error("Lỗi tại getPendingFriendRequests:", error);
    res.status(500).json({ message: "Lỗi máy chủ khi lấy lời mời kết bạn!" });
  }
};

// Tìm kiếm user để gửi lời mời kết bạn
export const searchUsers = async (req, res) => {
  try {
    // Hỗ trợ cả ?q= (frontend gửi) lẫn ?query= (fallback)
    const searchTerm = req.query.q || req.query.query;
    const userId = req.user._id;

    if (!searchTerm) {
      return res
        .status(400)
        .json({ message: "Vui lòng nhập từ khóa tìm kiếm!" });
    }

    // Tìm user theo username hoặc displayName, loại trừ chính bản thân mình
    const users = await User.find({
      $and: [
        { _id: { $ne: userId } }, // Không hiện chính mình trong kết quả tìm kiếm
        {
          $or: [
            { username: { $regex: searchTerm, $options: "i" } },
            { displayName: { $regex: searchTerm, $options: "i" } },
            { email: { $regex: searchTerm, $options: "i" } },
          ],
        },
      ],
    }).select("username displayName email avatarUrl");

    res.status(200).json(users);
  } catch (error) {
    console.error("Lỗi tại searchUsers:", error);
    res.status(500).json({ message: "Lỗi máy chủ khi tìm kiếm người dùng!" });
  }
};

// Xóa bạn bè
export const removeFriend = async (req, res) => {
  try {
    const userId = req.user._id;
    const { friendId } = req.params; // ví dụ: DELETE /api/friends/remove/:friendId
    console.log("friendId: ", friendId);

    // Tìm và xóa mối quan hệ bạn bè (bất kể ai là người gửi lời mời trước đó)
    const deletedFriendship = await Friendship.findOneAndDelete({
      $or: [
        { requesterId: userId, recipientId: friendId },
        { requesterId: friendId, recipientId: userId },
      ],
      status: "accepted",
    });

    if (!deletedFriendship) {
      return res
        .status(404)
        .json({ message: "Không tìm thấy mối quan hệ bạn bè để xóa!" });
    }

    res.status(200).json({ message: "Đã xóa bạn bè thành công!" });
  } catch (error) {
    console.error("Lỗi tại removeFriend:", error);
    res.status(500).json({ message: "Lỗi máy chủ khi xóa bạn bè!" });
  }
};
