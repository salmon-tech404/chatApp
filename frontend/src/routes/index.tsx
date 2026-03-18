// src/routes/index.tsx
//
// Cấu hình routing cho toàn bộ app
// – BrowserRouter: dùng URL thật (không có #)
// – Routes: chứa tất cả Route
// – Route: mỗi path tương ứng với 1 Component
// – Navigate: redirect sang trang khác

import { BrowserRouter, Routes, Route, Navigate } from "react-router";
import HomePage from "@/pages/HomePage";
import LoginPage from "@/pages/LoginPage";
import SignupPage from "@/pages/SignupPage";
import AboutPage from "@/pages/AboutPage";
// import ChatPage   from "@/pages/ChatPage"; // Sẽ làm sau

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public page */}
        <Route path='/' element={<HomePage />} />
        <Route path='/about' element={<AboutPage />} />

        {/* Auth pages */}
        <Route path='/login' element={<LoginPage />} />
        <Route path='/signup' element={<SignupPage />} />

        {/* Trang chat — sẽ làm sau */}
        {/* <Route path="/chat" element={<ChatPage />} /> */}

        {/* Mọi URL không tồn tại → về trang chủ */}
        <Route path='*' element={<Navigate to='/' replace />} />
      </Routes>
    </BrowserRouter>
  );
}
