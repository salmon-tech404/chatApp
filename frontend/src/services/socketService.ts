import { io, Socket } from "socket.io-client";
import { useAuthStore } from "../store/useAuthStore";
import { useChatStore } from "../store/useChatStore";
import type { Message } from "../types/chat";

const SOCKET_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

let socket: Socket | null = null;

export const connectSocket = () => {
  const { user } = useAuthStore.getState();
  
  if (!user || socket?.connected) return;

  socket = io(SOCKET_URL, {
    query: {
      userId: user._id,
    },
  });

  socket.on("connect", () => {
    console.log("Connected to socket server");
    socket?.emit("join", user._id);
  });

  socket.on("newMessage", (message: Message) => {
    // Kích hoạt store action khi có tin nhắn mới
    useChatStore.getState().receiveNewMessage(message);
  });

  socket.on("disconnect", () => {
    console.log("Disconnected from socket server");
  });
};

export const disconnectSocket = () => {
  if (socket?.connected) {
    socket.disconnect();
    socket = null;
  }
};

export const getSocket = () => socket;
