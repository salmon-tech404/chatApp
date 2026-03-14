import { BrowserRouter, Routes, Route, Navigate } from "react-router";
import HomePage  from "@/pages/HomePage";

// Auth pages — sẽ tạo sau
// import LoginPage  from "@/pages/LoginPage";
// import SignupPage from "@/pages/SignupPage";
// import ChatPage   from "@/pages/ChatPage";

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/"       element={<HomePage />} />
        {/* <Route path="/login"  element={<LoginPage />} /> */}
        {/* <Route path="/signup" element={<SignupPage />} /> */}
        {/* <Route path="/chat"   element={<ChatPage />} /> */}
        <Route path="*"       element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
