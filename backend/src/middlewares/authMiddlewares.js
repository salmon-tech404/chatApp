import jwt from "jsonwebtoken";
import User from "../models/User.js";

// Authorization middleware - xác minh user là ai thông qua token
export const protectedRoute = async (req, res, next) => {
  try {
    // lấy token từ header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Không thấy Access Token" });
    }
    //  xác nhận token
    const token = authHeader.split(" ")[1];
    if (!token) {
      return res.status(401).json({ message: "Không có token" });
    }
    // tìm user tương ứng với token
    jwt.verify(token, process.env.SECRET_TOKEN, async (err, decodedUser) => {
      if (err) {
        return res
          .status(401)
          .json({ message: "Access token hết hạn hoặc không đúng" });
      }
      const user = await User.findById(decodedUser.userId).select(
        "-hashedPassword",
      );
      if (!user) {
        return res.status(401).json({ message: "Người dùng không tồn tại" });
      }
      req.user = user; //gắn thêm dữ liệu vào req object để truyền xuống middleware/controller tiếp theo!
      next();
    });
  } catch (error) {
    console.error("Lỗi khi xác thực JWT token", error);
    return res.status(401).json({ message: "Lỗi hệ thống" });
  }
};
