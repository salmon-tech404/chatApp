import axiosInstance from "../lib/axios";
import type { Conversation, Message } from "../types/chat";

const chatService = {
  getConversations: async (): Promise<Conversation[]> => {
    const response = await axiosInstance.get("/conversations");
    return response.data;
  },

  createConversation: async (
    participantId: string | null,
    type: "direct" | "group" = "direct",
    name?: string,
    participants?: string[]
  ): Promise<Conversation> => {
    const response = await axiosInstance.post("/conversations", {
      participantId,
      type,
      name,
      participants
    });
    return response.data;
  },

  getMessages: async (conversationId: string): Promise<Message[]> => {
    const response = await axiosInstance.get(`/conversations/${conversationId}/messages`);
    return response.data;
  },

  sendMessage: async (
    conversationId: string,
    content: string,
    type: "text" | "image" | "file" = "text"
  ): Promise<Message> => {
    const response = await axiosInstance.post(`/conversations/${conversationId}/messages`, {
      content,
      type,
    });
    return response.data;
  },
};

export default chatService;
