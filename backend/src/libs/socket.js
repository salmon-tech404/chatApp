import { Server } from "socket.io";
import http from "http";
import express from "express";

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    methods: ["GET", "POST"],
  },
});

// Map để lưu trữ userId và socketId tương ứng
const userSocketMap = new Map();

io.on("connection", (socket) => {
  console.log("Client connected:", socket.id);

  // Khi user đăng nhập hoặc kết nối socket, họ sẽ gửi userId lên
  socket.on("join", (userId) => {
    userSocketMap.set(userId, socket.id);
    console.log(`User ${userId} joined with socket ${socket.id}`);
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected:", socket.id);
    // Xóa user khỏi map khi disconnect
    for (const [userId, socketId] of userSocketMap.entries()) {
      if (socketId === socket.id) {
        userSocketMap.delete(userId);
        break;
      }
    }
  });
});

export const getReceiverSocketId = (receiverId) => {
  return userSocketMap.get(receiverId);
};

export { app, io, server };
