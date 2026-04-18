import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import { connectDB } from "./libs/moongoDB.js";
import { app, server } from "./libs/socket.js";
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import conversationRoutes from "./routes/conversationRoutes.js";
import { protectedRoute } from "./middlewares/authMiddlewares.js";
import friendRoutes from "./routes/friendRoutes.js";

dotenv.config();

connectDB();

// ✅ CORS — phải đặt TRƯỚC tất cả routes
app.use(
  cors({
    origin: true, // reflect request origin (allows any origin in dev)
    credentials: true, // cho phép gửi cookie từ client
  }),
);
const SERVER_PORT = process.env.SERVER_PORT;
app.use(express.json({ limit: "10mb" }));
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
app.use("/api/conversations", conversationRoutes);
app.use("/api/friends", friendRoutes);

server.listen(SERVER_PORT, () => {
  console.log(`🚀 Server is running on port ${SERVER_PORT} 💓`);
});
