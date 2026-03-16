import { type ReactNode } from "react";

interface AuthLayoutProps {
  children: ReactNode;
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div
      style={{
        flex: 1,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "40px 24px",
      }}
    >
      <div
        style={{
          background: "rgba(255,255,255,0.07)",
          backdropFilter: "blur(24px)",
          border: "1px solid rgba(255,255,255,0.14)",
          borderRadius: 24,
          padding: "36px 32px",
          width: "100%",
          maxWidth: 420,
          boxShadow: "0 24px 60px rgba(0,0,0,0.3)",
        }}
      >
        {children}
      </div>
    </div>
  );
}
