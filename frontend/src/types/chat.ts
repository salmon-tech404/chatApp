import { User } from "./user";

export interface Participant extends User {
  role?: string;
}

export interface SeenUser extends User {
  seenAt?: string;
}

export interface Message {
  _id: string;
  conversationId: string;
  senderId: User | string; // Populate sẽ trả về đối tượng User, nếu không là ID
  content: string;
  type: "text" | "image" | "file";
  readBy?: User | string;
  isRevoked: boolean;
  createdAt: string;
  updatedAt: string;
}

export type LastMessage = Message;

export interface Group {
  _id?: string;
  name: string;
  avatarUrl?: string;
  members?: Participant[];
}

export interface Conversation {
  _id: string;
  participants: Participant[] | string[];
  type: "direct" | "group";
  name?: string;
  lastMessage?: LastMessage | string;
  lastMessageAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ConversationResponse {
  data: Conversation[];
  page?: number;
  total?: number;
  hasMore?: boolean;
}
