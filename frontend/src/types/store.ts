// Định nghĩa typescript interface cho Auth Store (zustand)
// Giống như bản vẽ của ngôi nhà cần những thứ gì gì

import type { User } from "@/types/user";

export interface AuthState {
  accessToken: string | null;
  user: User | null;
  loading: boolean;

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
