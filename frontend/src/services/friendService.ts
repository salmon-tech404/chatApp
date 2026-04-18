import axiosInstance from "../lib/axios";
import type { User, Friend, FriendRequest } from "../types/user";

const friendService = {
  searchUsers: async (query: string): Promise<User[]> => {
    const response = await axiosInstance.get(`/friends/search?q=${query}`);
    return response.data;
  },

  getFriends: async (): Promise<Friend[]> => {
    const response = await axiosInstance.get("/friends/list");
    return response.data;
  },

  getPendingRequests: async (): Promise<FriendRequest[]> => {
    const response = await axiosInstance.get("/friends/pending");
    return response.data;
  },

  sendFriendRequest: async (recipientId: string): Promise<void> => {
    await axiosInstance.post("/friends/request", { recipientId });
  },

  respondToRequest: async (
    friendshipId: string,
    status: "accepted" | "rejected"
  ): Promise<void> => {
    const action = status === "accepted" ? "accept" : "reject";
    await axiosInstance.post(`/friends/${friendshipId}/respond`, { action });
  },

  removeFriend: async (friendId: string): Promise<void> => {
    await axiosInstance.delete(`/friends/remove/${friendId}`);
  },

  cancelFriendRequest: async (receiverId: string): Promise<void> => {
    await axiosInstance.delete("/friends/cancel", { data: { receiverId } });
  },

  getFriendshipStatus: async (targetUserId: string): Promise<{
    status: "none" | "pending" | "accepted" | "rejected";
    friendshipId?: string;
    isSender?: boolean;
  }> => {
    const response = await axiosInstance.get(`/friends/status/${targetUserId}`);
    return response.data;
  },
};

export default friendService;
