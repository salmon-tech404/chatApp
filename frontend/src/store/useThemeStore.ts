import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { ThemeState } from "@/types/store";

export const useThemeStore = create<ThemeState>()(
  persist(
    (set, get) => ({
      isDarkMode: false,

      toggleTheme: () => {
        const newValue = !get().isDarkMode;
        // gọi "set" để lưu state mới
        set({ isDarkMode: newValue });
      },

      setTheme: (dark: boolean) => {
        // Lưu giá trị vào state
        set({ isDarkMode: dark });
      },
    }),
    {
      // tên key để persist vào localStorage
      name: "chat-theme",
    },
  ),
);
