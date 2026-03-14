import express from "express";
import { authMe, getProfile } from "../controllers/userController.js";

const router = express.Router();

router.get("/me", authMe);
router.get("/profile", getProfile); // Sử dụng getProfile để lấy thông tin người dùng

export default router;
