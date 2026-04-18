import express from "express";
import {
  getProfile,
  updateProfile,
  uploadAvatar,
  uploadCover,
  updateCoverOffset,
} from "../controllers/userController.js";

const router = express.Router();

router.get("/profile", getProfile);
router.patch("/profile", updateProfile);
router.post("/avatar", uploadAvatar);
router.post("/cover", uploadCover);
router.patch("/cover/offset", updateCoverOffset);

export default router;
