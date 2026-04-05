import { useAuthStore } from "@/store/useAuthStore";
import axios from "axios";

const api = axios.create({
  baseURL:
    import.meta.env.MODE === "development"
      ? "http://localhost:5001/api"
      : "/api",
  withCredentials: true,
});

// Gắn access token vào header của mọi request nếu có
api.interceptors.request.use((config) => {
  const { accessToken } = useAuthStore.getState();
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});

let isRefreshing = false;

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Nếu 401 và chưa thử refresh
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      // Tránh nhiều request cùng refresh một lúc
      if (!isRefreshing) {
        isRefreshing = true;
        try {
          await useAuthStore.getState().refresh();
          isRefreshing = false;
        } catch {
          isRefreshing = false;
          // Refresh thất bại → logout
          useAuthStore.getState().signOut();
          return Promise.reject(error);
        }
      }

      // Retry request với token mới
      const newToken = useAuthStore.getState().accessToken;
      originalRequest.headers.Authorization = `Bearer ${newToken}`;
      return api(originalRequest);
    }

    return Promise.reject(error);
  },
);

export default api;
