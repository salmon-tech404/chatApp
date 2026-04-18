import api from "@/lib/axios";
import type { User } from "@/types/user";

const userService = {
  getProfile: async (): Promise<User> => {
    const res = await api.get("/users/profile");
    return res.data;
  },

  updateProfile: async (data: {
    displayName?: string;
    bio?: string;
    gender?: "male" | "female" | "other" | null;
    birthday?: string | null;
    phone?: string;
  }): Promise<User> => {
    const res = await api.patch("/users/profile", data);
    return res.data;
  },

  uploadAvatar: async (imageBase64: string): Promise<User> => {
    const res = await api.post("/users/avatar", { imageBase64 });
    return res.data;
  },

  uploadCover: async (imageBase64: string, offsetY: number): Promise<User> => {
    const res = await api.post("/users/cover", { imageBase64, offsetY });
    return res.data;
  },

  updateCoverOffset: async (offsetY: number): Promise<User> => {
    const res = await api.patch("/users/cover/offset", { offsetY });
    return res.data;
  },
};

export default userService;
