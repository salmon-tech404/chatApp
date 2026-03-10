import mongoose from "mongoose";

const userShema = new mongoose.Schema(
  {
    username: {
      type: String,
      require: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    hashedPassword: {
      type: String,
      require: true,
    },
    email: {
      type: String,
      require: true,
      lowercase: true,
      lowercase: true,
      trim: true,
    },
    display: {
      type: String,
      require: true,
      trim: true,
    },
    avataUrl: {
      type: String, //Link CND để hiển thị hình
    },
    avataId: {
      type: String, //Cloudinary public_id để xóa hình
    },
    bio: {
      type: String,
      maxlength: 500,
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
