import { create } from "zustand";

interface OnlineState {
  onlineUserIds: string[];
  setOnlineUsers: (userIds: string[]) => void;
  isOnline: (userId: string) => boolean;
}

export const useOnlineStore = create<OnlineState>()((set, get) => ({
  onlineUserIds: [],

  setOnlineUsers: (userIds: string[]) => set({ onlineUserIds: userIds }),

  isOnline: (userId: string) => get().onlineUserIds.includes(userId),
}));
