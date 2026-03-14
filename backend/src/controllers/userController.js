import User from "../models/User.js";

export const authMe = async (req, res) => {
  try {
    const user = req.user; // Lấy thông tin user từ req.user do middleware đã gán
    if (!user) {
      return res.status(404).json({ message: "User không tồn tại" });
    } else {
      return res.status(200).json({
        user,
      });
    }
  } catch (error) {
    console.error("Lỗi khi xác thực người dùng", error);
    return res.status(500).json({ message: "Lỗi hệ thống" });
  }
};

export const getProfile = async (req, res) => {
  try {
    const user = req.user; // Lấy thông tin user từ req.user do middleware đã gán
    if (!user) {
      return res.status(404).json({ message: "User không tồn tại" });
    }
    return res.status(200).json({
      id: user._id,
      username: user.username,
      email: user.email,
    });
  } catch (error) {
    console.error("Lỗi khi lấy thông tin người dùng", error);
    return res.status(500).json({ message: "Lỗi hệ thống" });
  }
};
