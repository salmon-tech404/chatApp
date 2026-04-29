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
import { createRateLimiter } from "./middlewares/rateLimiter.js";

dotenv.config();

connectDB();

// ✅ CORS — phải đặt TRƯỚC tất cả routes
const allowedOrigins = process.env.CLIENT_URL
  ? process.env.CLIENT_URL.split(",").map((o) => o.trim())
  : true; // dev fallback: allow all

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  }),
);
const SERVER_PORT = process.env.PORT || process.env.SERVER_PORT || 5000;
app.use(express.json({ limit: "10mb" }));
app.use(cookieParser());

// ✅ RATE LIMITER — đặt SAU cookieParser, TRƯỚC các routes  👈
const authLimiter = createRateLimiter({
  max: 3,
  windowMs: 15 * 60 * 1000,
  reason: "Quá nhiều lần thử đăng nhập/đăng ký",
});

app.use("/api/auth", authLimiter); // phải trước app.use("/api/auth", authRoutes)

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
