import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./libs/moongoDB.js";
import authRoutes from "./routes/authRoutes.js";
import cookieParser from "cookie-parser";
import userRoutes from "./routes/userRoutes.js";
import { protectedRoute } from "./middlewares/authMiddlewares.js";

dotenv.config();

const app = express();
connectDB();
const SERVER_PORT = process.env.SERVER_PORT;
app.use(express.json());
app.use(cookieParser());
// middlewares
app.get("/", (req, res) => {
  res.send("Hello Server!");
});

/* ---------- PUBLIC ROUTES ---------- */
app.use("/api/auth", authRoutes);

/* ---------- PRIVATE ROUTES ---------- */
app.use(protectedRoute); // áp dụng middleware bảo vệ cho tất cả routes sau nó
app.use("/api/users", userRoutes);

app.listen(SERVER_PORT, () => {
  console.log(`🚀 Server is running on port ${SERVER_PORT} 💓`);
});
