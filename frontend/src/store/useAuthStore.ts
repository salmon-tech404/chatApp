import { create } from "zustand";
import { toast } from "sonner";
import { authService } from "@/services/authService";
import type { AuthState } from "@/types/store";

export const useAuthStore = create<AuthState>((set, get) => ({
  accessToken: null,
  user: null,
  loading: false,

  signUp: async (username, password, email, firstName, lastName) => {
    try {
      set({ loading: true });
      // gọi API đăng ký
      await authService.signUp(username, password, email, firstName, lastName);

      toast.success("Đăng ký thành công! 🎉");
    } catch (error) {
      console.error("Lỗi đăng ký:", error);
      toast.error("Đăng ký thất bại! 😢");
    } finally {
      set({ loading: false });
    }
  },
}));
