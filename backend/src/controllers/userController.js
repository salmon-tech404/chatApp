import User from "../models/User.js";
import getCloudinary from "../libs/cloudinary.js";

const sanitize = (user) => ({
  _id: user._id,
  username: user.username,
  email: user.email,
  displayName: user.displayName,
  avatarUrl: user.avatarUrl,
  coverPhotoUrl: user.coverPhotoUrl,
  coverOffsetY: user.coverOffsetY ?? 50,
  bio: user.bio,
  gender: user.gender,
  birthday: user.birthday,
  phone: user.phone,
  createdAt: user.createdAt,
  updatedAt: user.updatedAt,
});

export const getProfile = async (req, res) => {
  try {
    if (!req.user) return res.status(404).json({ message: "User không tồn tại" });
    return res.status(200).json(sanitize(req.user));
  } catch (error) {
    console.error("getProfile error", error);
    return res.status(500).json({ message: "Lỗi hệ thống" });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const user = req.user;
    const { displayName, bio, gender, birthday, phone } = req.body;

    if (displayName !== undefined && displayName.trim()) user.displayName = displayName.trim();
    if (bio !== undefined) user.bio = bio;
    if (gender !== undefined) user.gender = gender || null;
    if (birthday !== undefined) user.birthday = birthday ? new Date(birthday) : null;
    if (phone !== undefined) user.phone = phone;

    await user.save();
    return res.status(200).json(sanitize(user));
  } catch (error) {
    console.error("updateProfile error", error);
    return res.status(500).json({ message: "Lỗi hệ thống" });
  }
};

export const uploadAvatar = async (req, res) => {
  try {
    const { imageBase64 } = req.body;
    if (!imageBase64) return res.status(400).json({ message: "Thiếu dữ liệu hình ảnh" });

    const user = req.user;

    if (user.avatarId) {
      await getCloudinary().uploader.destroy(user.avatarId).catch(() => {});
    }

    const result = await getCloudinary().uploader.upload(imageBase64, {
      folder: "halo/avatars",
      transformation: [{ width: 400, height: 400, crop: "fill", gravity: "face" }],
    });

    user.avatarUrl = result.secure_url;
    user.avatarId = result.public_id;
    await user.save();

    return res.status(200).json(sanitize(user));
  } catch (error) {
    console.error("uploadAvatar error", error);
    return res.status(500).json({ message: "Lỗi khi tải ảnh lên" });
  }
};

export const uploadCover = async (req, res) => {
  try {
    const { imageBase64, offsetY } = req.body;
    if (!imageBase64) return res.status(400).json({ message: "Thiếu dữ liệu hình ảnh" });

    const user = req.user;

    if (user.coverPhotoId) {
      await getCloudinary().uploader.destroy(user.coverPhotoId).catch(() => {});
    }

    const result = await getCloudinary().uploader.upload(imageBase64, {
      folder: "halo/covers",
      transformation: [{ width: 1400, crop: "limit" }],
    });

    user.coverPhotoUrl = result.secure_url;
    user.coverPhotoId = result.public_id;
    if (offsetY !== undefined) user.coverOffsetY = Number(offsetY);
    await user.save();

    return res.status(200).json(sanitize(user));
  } catch (error) {
    console.error("uploadCover error", error);
    return res.status(500).json({ message: "Lỗi khi tải ảnh bìa lên" });
  }
};

export const updateCoverOffset = async (req, res) => {
  try {
    const { offsetY } = req.body;
    if (offsetY === undefined) return res.status(400).json({ message: "Thiếu offsetY" });

    const user = req.user;
    user.coverOffsetY = Number(offsetY);
    await user.save();

    return res.status(200).json(sanitize(user));
  } catch (error) {
    console.error("updateCoverOffset error", error);
    return res.status(500).json({ message: "Lỗi hệ thống" });
  }
};
