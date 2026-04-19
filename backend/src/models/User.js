import mongoose from "mongoose";

const userShema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    hashedPassword: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    displayName: {
      type: String,
      required: true,
      trim: true,
    },
    avatarUrl: {
      type: String,
    },
    avatarId: {
      type: String,
    },
    coverPhotoUrl: {
      type: String,
    },
    coverPhotoId: {
      type: String,
    },
    coverOffsetY: {
      type: Number,
      default: 50,
    },
    bio: {
      type: String,
      maxlength: 500,
    },
    gender: {
      type: String,
      enum: ["male", "female", "other", null],
      default: null,
    },
    birthday: {
      type: Date,
      default: null,
    },
    phone: {
      type: String,
      sparse: true,
    },
  },
  { timestamps: true },
);

const User = mongoose.model("User", userShema);
export default User;
