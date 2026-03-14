import express from "express";
import { getProfile } from "../controllers/userController.js";

const router = express.Router();

router.get("/profile", getProfile); // Sử dụng getProfile để lấy thông tin người dùng

export default router;
