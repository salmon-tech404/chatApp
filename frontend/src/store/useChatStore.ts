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
  unreadCounts: {},

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
    // Reset unread count khi mở conversation
    const { unreadCounts } = get();
    set({
      selectedConversation: conversation,
      messages: [],
      unreadCounts: { ...unreadCounts, [conversation._id]: 0 },
    });
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
    const { selectedConversation } = get();
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
    const { selectedConversation, messages, unreadCounts, conversations } = get();
    const convId = String(message.conversationId);

    if (selectedConversation && convId === String(selectedConversation._id)) {
      const isDuplicate = messages.some((m) => m._id === message._id);
      if (!isDuplicate) {
        set({ messages: [...messages, message] });
      }
    } else {
      set({
        unreadCounts: {
          ...unreadCounts,
          [convId]: (unreadCounts[convId] ?? 0) + 1,
        },
      });
    }

    // Update lastMessage/lastMessageAt in-place — avoids full refetch on every message
    const exists = conversations.some((c) => String(c._id) === convId);
    if (exists) {
      set({
        conversations: conversations.map((c) =>
          String(c._id) === convId
            ? { ...c, lastMessage: message, lastMessageAt: message.createdAt }
            : c,
        ),
      });
    } else {
      // Unknown conversation (e.g. added to a new group) — fetch once to get full data
      get().fetchConversations();
    }
  },
}));
