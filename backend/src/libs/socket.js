import { Server } from "socket.io";
import http from "http";
import express from "express";

const app = express();
const server = http.createServer(app);

const allowedOrigins = process.env.CLIENT_URL
  ? process.env.CLIENT_URL.split(",").map((o) => o.trim())
  : true;

const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    methods: ["GET", "POST"],
    credentials: true,
  },
});

const userSocketMap = new Map();

io.on("connection", (socket) => {
  const queryUserId = socket.handshake.query?.userId;

  socket.on("join", (userId) => {
    if (!userId || (queryUserId && userId !== queryUserId)) return;
    userSocketMap.set(userId, socket.id);
    io.emit("onlineUsers", Array.from(userSocketMap.keys()));
  });

  socket.on("disconnect", () => {
    for (const [userId, socketId] of userSocketMap.entries()) {
      if (socketId === socket.id) {
        userSocketMap.delete(userId);
        break;
      }
    }
    io.emit("onlineUsers", Array.from(userSocketMap.keys()));
  });

  socket.on("error", (err) => {
    console.error("Socket error:", err.message);
  });
});

export const getReceiverSocketId = (receiverId) => userSocketMap.get(receiverId);

export { app, io, server };
