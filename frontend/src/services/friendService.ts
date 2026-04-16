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

  sendFriendRequest: async (recipientId: string): Promise<any> => {
    const response = await axiosInstance.post("/friends/request", { recipientId });
    return response.data;
  },

  respondToRequest: async (
    friendshipId: string,
    status: "accepted" | "rejected"
  ): Promise<any> => {
    const response = await axiosInstance.post(`/friends/${friendshipId}/respond`, { status });
    return response.data;
  },
  
  removeFriend: async (friendId: string): Promise<any> => {
    const response = await axiosInstance.delete(`/friends/remove/${friendId}`);
    return response.data;
  }
};

export default friendService;
