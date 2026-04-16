import { create } from "zustand";
import type { ChatState } from "@/types/store";
import chatService from "@/services/chatService";
import { toast } from "sonner";
import type { Message, Conversation } from "@/types/chat";

export const useChatStore = create<ChatState>()((set, get) => ({
  conversations: [],
  selectedConversation: null,
  messages: [],
  isLoading: false,
  isSending: false,

  fetchConversations: async () => {
    set({ isLoading: true });
    try {
      const data = await chatService.getConversations();
      set({ conversations: data, isLoading: false });
    } catch (error) {
      console.error("Error khi tải danh sách đoạn chat:", error);
      toast.error("Không thể tải danh sách đoạn chat!");
      set({ isLoading: false });
    }
  },

  selectConversation: (conversation: Conversation) => {
    set({ selectedConversation: conversation, messages: [] });
    // Whenever a conversation is selected, fetch messages
    get().fetchMessages(conversation._id);
  },

  fetchMessages: async (conversationId: string) => {
    set({ isLoading: true });
    try {
      const data = await chatService.getMessages(conversationId);
      set({ messages: data, isLoading: false });
    } catch (error) {
      console.error("Error khi tải tin nhắn:", error);
      toast.error("Không thể tải tin nhắn!");
      set({ isLoading: false });
    }
  },

  sendMessage: async (
    content: string,
    type: "text" | "image" | "file" = "text",
  ) => {
    const { selectedConversation, messages } = get();
    if (!selectedConversation) return;

    set({ isSending: true });
    try {
      const newMessage = await chatService.sendMessage(
        selectedConversation._id,
        content,
        type,
      );
      // Cập nhật optimistic / backend response
      set({ messages: [...get().messages, newMessage], isSending: false });
    } catch (error) {
      console.error("Error khi gửi tin nhắn:", error);
      toast.error("Gửi tin nhắn thất bại!");
      set({ isSending: false });
    }
  },

  receiveNewMessage: (message: Message) => {
    const { selectedConversation, messages } = get();

    // Nếu tin nhắn mới thuộc về đoạn chat đang mở
    if (
      selectedConversation &&
      message.conversationId === selectedConversation._id
    ) {
      // Tránh duplicate nếu người gửi chính là mình (đã thêm lúc sendMessage)
      const isDuplicate = messages.some((m) => m._id === message._id);
      if (!isDuplicate) {
        set({ messages: [...messages, message] });
      }
    }

    // Refresh danh sách conversations để đẩy đoạn chat lên đầu
    get().fetchConversations();
  },
}));
