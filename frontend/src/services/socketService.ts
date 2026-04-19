import { io, Socket } from "socket.io-client";
import { useAuthStore } from "../store/useAuthStore";
import { useChatStore } from "../store/useChatStore";
import { useOnlineStore } from "../store/useOnlineStore";
import type { Message } from "../types/chat";

let socket: Socket | null = null;

export const connectSocket = () => {
  const { user } = useAuthStore.getState();

  if (!user || socket?.connected) return;

  // Connect to current origin so requests go through the Vite proxy (works for both localhost and external tunnels)
  socket = io(window.location.origin, {
    path: "/socket.io",
    query: {
      userId: user._id,
    },
  });

  socket.on("connect", () => {
    console.log("Connected to socket server");
    socket?.emit("join", user._id);
  });

  socket.on("newMessage", (message: Message) => {
    useChatStore.getState().receiveNewMessage(message);
  });

  socket.on("newGroup", () => {
    // Có group mới được tạo và mình là thành viên → tải lại danh sách conversations
    useChatStore.getState().fetchConversations();
  });

  socket.on("onlineUsers", (userIds: string[]) => {
    useOnlineStore.getState().setOnlineUsers(userIds);
  });

  socket.on("connect_error", (err) => {
    console.error("Socket connection error:", err.message);
  });

  socket.on("error", (err: Error) => {
    console.error("Socket error:", err.message);
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
