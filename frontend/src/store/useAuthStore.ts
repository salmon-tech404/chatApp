import { create } from "zustand";
import { toast } from "sonner";
import { authService } from "@/services/authService";
import type { AuthState } from "@/types/store";
import { persist } from "zustand/middleware";

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      accessToken: null,
      user: null,
      loading: false,

      setAccessToken: (accessToken) => set({ accessToken }),
      clearState: () => {
        set({ accessToken: null, user: null, loading: false });
        localStorage.clear();
      },

      signUp: async (username, password, email, firstName, lastName) => {
        try {
          set({ loading: true });
          // gọi API đăng ký
          await authService.signUp(
            username,
            password,
            email,
            firstName,
            lastName,
          );
          toast.success("Đăng ký thành công! 🎉");
        } catch (error: unknown) {
          const message =
            error instanceof Error ? error.message : "Đăng ký thất bại!";
          toast.error(message);
          throw error; // ném lại để form biết mà không navigate
        } finally {
          set({ loading: false });
        }
      },

      signIn: async (username, password) => {
        try {
          set({ loading: true });
          localStorage.clear();
          const data = await authService.signIn(username, password);

          //   Lưu token và thông tin user vào state (Store)
          set({ accessToken: data.accessToken, user: data.user });
          localStorage.setItem("accessToken", data.accessToken);
          toast.success("Chào mừng bạn quay lại với Halo 🎉");
        } catch (error: unknown) {
          const message =
            error instanceof Error ? error.message : "Đăng nhập thất bại!";
          toast.error(message);
          throw error; // ném lại để form biết mà không navigate
        } finally {
          set({ loading: false });
        }
      },

      signOut: async () => {
        try {
          await authService.signOut();
        } finally {
          set({ accessToken: null, user: null });
          localStorage.removeItem("accessToken");
          toast.success("Đăng xuất thành công! 👋");
        }
      },

      refresh: async () => {
        try {
          set({ loading: true });
          const accessToken = await authService.refresh();
          set({ accessToken });
          localStorage.setItem("accessToken", accessToken);
        } catch (error: unknown) {
          const message =
            error instanceof Error ? error.message : "Làm mới token thất bại!";
          toast.error(message);
        } finally {
          set({ loading: false });
        }
      },
    }),
    {
      name: "auth-storage", // tên key trong localStorage
      partialize: (state) => ({ user: state.user }),
    },
  ),
);
