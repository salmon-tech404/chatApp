// frontend/src/components/auth/ProtectedRoute.tsx
import { useAuthStore } from "@/store/useAuthStore";

import { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router";

const ProtectedRoute = () => {
  const { accessToken, loading, refresh, signOut } = useAuthStore();
  const [starting, setStarting] = useState(true);

  useEffect(() => {
    const bootstrap = async () => {
      const savedToken = localStorage.getItem("accessToken");
      if (savedToken && !accessToken) {
        // Thêm dòng này: gọi lên backend để verify
        // → backend mới có cơ hội check session.expiresAt
        try {
          await refresh();
        } catch {
          await signOut();
        }
      }
      setStarting(false);
    };
    bootstrap();
  }, [refresh, signOut, accessToken]);

  // Đang khởi động hoặc đang loading → chưa render gì
  if (starting || loading) {
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: "100vh",
          background:
            "linear-gradient(145deg, #0d2137 0%, #0a3d4a 48%, #083d38 100%)",
          color: "rgba(255,255,255,0.5)",
          fontFamily: "var(--font-body)",
          fontSize: 14,
          gap: 10,
        }}
      >
        <div
          style={{
            width: 18,
            height: 18,
            border: "2px solid rgba(45,212,191,0.3)",
            borderTop: "2px solid #2dd4bf",
            borderRadius: "50%",
            animation: "spin 0.8s linear infinite",
          }}
        />
        Đang kiểm tra...
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  // Không có token → về trang login
  if (!accessToken) {
    return <Navigate to='/login' replace />;
  }

  // Có token → render các route con
  return <Outlet />;
};

export default ProtectedRoute;
