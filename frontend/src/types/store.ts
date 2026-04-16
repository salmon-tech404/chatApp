// Định nghĩa typescript interface cho Auth Store (zustand)
// Giống như bản vẽ của ngôi nhà cần những thứ gì gì

import type { User } from "@/types/user";
import type { Conversation, Message } from "@/types/chat";

export interface AuthState {
  accessToken: string | null;
  setAccessToken: (accessToken: string | null) => void;
  user: User | null;
  loading: boolean;
  clearState: () => void;

  signUp: (
    username: string,
    password: string,
    email: string,
    firstName: string,
    lastName: string,
  ) => Promise<void>;

  signIn: (username: string, password: string) => Promise<void>;

  signOut: () => Promise<void>;

  refresh: () => Promise<void>;
}

export interface ThemeState {
  isDarkMode: boolean;
  toggleTheme: () => void;
  setTheme: (dark: boolean) => void;
}


export interface ChatState {
  conversations: Conversation[];
  selectedConversation: Conversation | null;
  messages: Message[];
  isLoading: boolean;
  isSending: boolean;
  
  // Actions
  fetchConversations: () => Promise<void>;
  selectConversation: (conversation: Conversation) => void;
  fetchMessages: (conversationId: string) => Promise<void>;
  sendMessage: (content: string, type?: "text" | "image" | "file") => Promise<void>;
  receiveNewMessage: (message: Message) => void;
}