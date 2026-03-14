import bcrypt from "bcrypt";
import jwt from "jsonwebtoken"; //tạo jwt token
import User from "../models/User.js";
import crypto from "crypto"; //tạo random token
import Session from "../models/Session.js";
const REFRESH_TOKEN_TTL = 10 * 1000;
// 14 * 24 * 60 * 60 * 1000;

export const signUp = async (req, res) => {
  try {
    const { username, password, email, firstname, lastname } = req.body;
    if (!username || !password || !email || !firstname || !lastname) {
      return res
        .status(400)
        .json({ message: "Thiếu thông tin đăng ký, xin kiểm tra lại" });
    }
    // Kiểm tra user có tốn tại chưa
    const duplicate = await User.findOne({ username });
    if (duplicate) {
      return res.status(409).json({ message: "Username đã tồn tại" });
    }

    // Mã hóa password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Tạo user mới
    await User.create({
      username,
      hashedPassword,
      email,
      displayName: `${firstname} ${lastname}`,
    });

    // return
    return res.sendStatus(204);
  } catch (error) {
    console.error("Lỗi khi gọi signUp", error);
    return res.status(500).json({ message: "Lỗi hệ thống" });
  }
};

export const signIn = async (req, res) => {
  try {
    const { username, password } = req.body;

    // Kiểm tra dữ liệu
    if (!username || !password) {
      return res.status(400).json({ message: "Thiếu username hoặc password" });
    }

    // Tìm user
    const user = await User.findOne({ username });

    if (!user) {
      return res.status(401).json({ message: "Sai username hoặc password" });
    }

    // So sánh password
    const passwordCorrect = await bcrypt.compare(password, user.hashedPassword);

    if (!passwordCorrect) {
      return res.status(401).json({ message: "Sai username hoặc password" });
    }

    // Tạo JWT token
    const accessToken = jwt.sign(
      { userId: user._id },
      process.env.SECRET_TOKEN,
      { expiresIn: process.env.ACCESS_TOKEN_TTL },
    );

    // Tạo refreshToken
    const refreshToken = crypto.randomBytes(64).toString("hex");
    // Tạo Session để lưu refresh token vào DB
    await Session.create({
      userId: user._id,
      refreshToken,
      expiresAt: new Date(Date.now() + REFRESH_TOKEN_TTL),
    });

    // Trả refresh token về trong cookie
    res.cookie("refreshToken", refreshToken, {
      // thêm cấu hình cho cookie
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: REFRESH_TOKEN_TTL,
    });

    // Trả về kết quả
    return res.status(200).json({
      message: "Đăng nhập thành công",
      accessToken,
      user: {
        id: user._id,
        username: user.username,
        displayName: user.displayName,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("Lỗi khi gọi signIn", error);
    return res.status(500).json({ message: "Lỗi hệ thống" });
  }
};

export const signOut = async (req, res) => {
  try {
    const refreshToken = req.cookies?.refreshToken;
    if (!refreshToken) {
      return res.sendStatus(204);
    }
    // Xóa session trong DB
    await Session.deleteOne({ refreshToken });

    // Xóa cookie
    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "none",
    });

    return res.status(200).json({
      message: "Đăng xuất thành công",
    });
  } catch (error) {
    console.error("Lỗi khi gọi signOut", error);
    return res.status(500).json({ message: "Lỗi hệ thống" });
  }
};
