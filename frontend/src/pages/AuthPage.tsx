import { useState } from "react";
import { MessageCircle, Lock, User, Mail, Eye, EyeOff, ArrowRight } from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────
type Tab = "login" | "signup";

// ─── Floating bubble decoration ───────────────────────────────────────────────
function Bubble({ size, x, y, delay, opacity }: { size: number; x: string; y: string; delay: string; opacity: number }) {
  return (
    <div
      style={{
        position: "absolute",
        width: size,
        height: size,
        left: x,
        top: y,
        borderRadius: "50%",
        background: "radial-gradient(circle at 30% 30%, rgba(255,255,255,0.18), rgba(255,255,255,0.04))",
        border: "1px solid rgba(255,255,255,0.12)",
        animation: `floatBubble 6s ease-in-out infinite`,
        animationDelay: delay,
        opacity,
        backdropFilter: "blur(2px)",
      }}
    />
  );
}

// ─── Input Field ──────────────────────────────────────────────────────────────
function InputField({
  icon: Icon,
  placeholder,
  type = "text",
  value,
  onChange,
}: {
  icon: React.ElementType;
  placeholder: string;
  type?: string;
  value: string;
  onChange: (v: string) => void;
}) {
  const [showPass, setShowPass] = useState(false);
  const [focused, setFocused] = useState(false);
  const isPassword = type === "password";

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 10,
        background: focused ? "rgba(255,255,255,0.14)" : "rgba(255,255,255,0.08)",
        border: focused ? "1px solid rgba(255,255,255,0.5)" : "1px solid rgba(255,255,255,0.18)",
        borderRadius: 12,
        padding: "12px 16px",
        transition: "all 0.25s ease",
        cursor: "text",
      }}
    >
      <Icon size={16} color={focused ? "#fff" : "rgba(255,255,255,0.5)"} style={{ flexShrink: 0, transition: "color 0.2s" }} />
      <input
        type={isPassword && showPass ? "text" : type}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        style={{
          flex: 1,
          background: "none",
          border: "none",
          outline: "none",
          color: "#fff",
          fontSize: 14,
          fontFamily: "'DM Sans', sans-serif",
        }}
      />
      {isPassword && (
        <button
          type="button"
          onClick={() => setShowPass(!showPass)}
          style={{ background: "none", border: "none", cursor: "pointer", padding: 0, display: "flex" }}
        >
          {showPass ? <EyeOff size={15} color="rgba(255,255,255,0.4)" /> : <Eye size={15} color="rgba(255,255,255,0.4)" />}
        </button>
      )}
    </div>
  );
}

// ─── Login Form ───────────────────────────────────────────────────────────────
function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <InputField icon={Mail} placeholder="Email hoặc số điện thoại" type="email" value={email} onChange={setEmail} />
      <InputField icon={Lock} placeholder="Mật khẩu" type="password" value={password} onChange={setPassword} />

      <div style={{ display: "flex", justifyContent: "flex-end" }}>
        <button
          style={{
            background: "none",
            border: "none",
            color: "rgba(255,255,255,0.55)",
            fontSize: 12,
            cursor: "pointer",
            fontFamily: "'DM Sans', sans-serif",
            transition: "color 0.2s",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.color = "#fff")}
          onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.55)")}
        >
          Quên mật khẩu?
        </button>
      </div>

      <button
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 8,
          background: "linear-gradient(135deg, #2dd4bf, #0ea5e9)",
          border: "none",
          borderRadius: 12,
          padding: "13px 0",
          color: "#fff",
          fontSize: 15,
          fontWeight: 600,
          fontFamily: "'DM Sans', sans-serif",
          cursor: "pointer",
          marginTop: 4,
          transition: "opacity 0.2s, transform 0.15s",
          boxShadow: "0 4px 20px rgba(45,212,191,0.35)",
        }}
        onMouseEnter={(e) => { e.currentTarget.style.opacity = "0.9"; e.currentTarget.style.transform = "translateY(-1px)"; }}
        onMouseLeave={(e) => { e.currentTarget.style.opacity = "1"; e.currentTarget.style.transform = "translateY(0)"; }}
      >
        Đăng nhập <ArrowRight size={16} />
      </button>
    </div>
  );
}

// ─── Signup Form ──────────────────────────────────────────────────────────────
function SignupForm() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <InputField icon={User} placeholder="Tên người dùng" value={username} onChange={setUsername} />
      <InputField icon={Mail} placeholder="Email" type="email" value={email} onChange={setEmail} />
      <InputField icon={Lock} placeholder="Mật khẩu" type="password" value={password} onChange={setPassword} />
      <InputField icon={Lock} placeholder="Xác nhận mật khẩu" type="password" value={confirm} onChange={setConfirm} />

      <button
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 8,
          background: "linear-gradient(135deg, #2dd4bf, #0ea5e9)",
          border: "none",
          borderRadius: 12,
          padding: "13px 0",
          color: "#fff",
          fontSize: 15,
          fontWeight: 600,
          fontFamily: "'DM Sans', sans-serif",
          cursor: "pointer",
          marginTop: 4,
          transition: "opacity 0.2s, transform 0.15s",
          boxShadow: "0 4px 20px rgba(45,212,191,0.35)",
        }}
        onMouseEnter={(e) => { e.currentTarget.style.opacity = "0.9"; e.currentTarget.style.transform = "translateY(-1px)"; }}
        onMouseLeave={(e) => { e.currentTarget.style.opacity = "1"; e.currentTarget.style.transform = "translateY(0)"; }}
      >
        Tạo tài khoản <ArrowRight size={16} />
      </button>
    </div>
  );
}

// ─── Main Auth Page ───────────────────────────────────────────────────────────
export default function AuthPage() {
  const [tab, setTab] = useState<Tab>("login");

  return (
    <>
      {/* Google Fonts */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=Syne:wght@700;800&display=swap');

        * { box-sizing: border-box; margin: 0; padding: 0; }

        body {
          background: linear-gradient(135deg, #0d2137 0%, #0a3d4a 50%, #083d38 100%);
          min-height: 100vh;
          font-family: 'DM Sans', sans-serif;
        }

        ::placeholder { color: rgba(255,255,255,0.35) !important; }

        @keyframes floatBubble {
          0%, 100% { transform: translateY(0px) scale(1); }
          50% { transform: translateY(-18px) scale(1.03); }
        }

        @keyframes fadeSlideIn {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        @keyframes formFade {
          from { opacity: 0; transform: translateX(8px); }
          to   { opacity: 1; transform: translateX(0); }
        }
      `}</style>

      {/* Full page wrapper */}
      <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", position: "relative", overflow: "hidden" }}>

        {/* Decorative bubbles */}
        <Bubble size={320} x="-80px" y="-80px" delay="0s" opacity={0.6} />
        <Bubble size={200} x="60%" y="-40px" delay="1.5s" opacity={0.4} />
        <Bubble size={150} x="80%" y="60%" delay="3s" opacity={0.3} />
        <Bubble size={250} x="-40px" y="65%" delay="2s" opacity={0.35} />
        <Bubble size={120} x="72%" y="15%" delay="0.8s" opacity={0.25} />

        {/* Navbar */}
        <nav style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "20px 48px",
          position: "relative",
          zIndex: 10,
        }}>
          {/* Logo */}
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{
              width: 38, height: 38,
              background: "linear-gradient(135deg, #2dd4bf, #0ea5e9)",
              borderRadius: 10,
              display: "flex", alignItems: "center", justifyContent: "center",
              boxShadow: "0 4px 14px rgba(45,212,191,0.4)",
            }}>
              <MessageCircle size={20} color="#fff" />
            </div>
            <span style={{ color: "#fff", fontSize: 18, fontWeight: 700, fontFamily: "'Syne', sans-serif", letterSpacing: "-0.3px" }}>
              ChatApp
            </span>
          </div>

          {/* Nav links */}
          <div style={{ display: "flex", gap: 32 }}>
            {["Trang chủ", "Tính năng", "Về chúng tôi", "Liên hệ"].map((item) => (
              <button
                key={item}
                style={{
                  background: "none", border: "none",
                  color: "rgba(255,255,255,0.6)", fontSize: 14,
                  cursor: "pointer", fontFamily: "'DM Sans', sans-serif",
                  transition: "color 0.2s",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "#fff")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.6)")}
              >
                {item}
              </button>
            ))}
          </div>

          {/* CTA button */}
          <button style={{
            background: "linear-gradient(135deg, #2dd4bf22, #0ea5e922)",
            border: "1px solid rgba(45,212,191,0.4)",
            borderRadius: 8,
            padding: "8px 20px",
            color: "#2dd4bf",
            fontSize: 13,
            fontWeight: 600,
            cursor: "pointer",
            fontFamily: "'DM Sans', sans-serif",
            transition: "all 0.2s",
          }}
          onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(45,212,191,0.15)"; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = "linear-gradient(135deg, #2dd4bf22, #0ea5e922)"; }}
          >
            Tải ứng dụng
          </button>
        </nav>

        {/* Hero section */}
        <div style={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "40px 48px",
          gap: 80,
          position: "relative",
          zIndex: 5,
        }}>

          {/* Left — Auth card */}
          <div style={{
            background: "rgba(255,255,255,0.07)",
            backdropFilter: "blur(24px)",
            border: "1px solid rgba(255,255,255,0.14)",
            borderRadius: 24,
            padding: "36px 32px",
            width: 380,
            flexShrink: 0,
            boxShadow: "0 24px 60px rgba(0,0,0,0.3)",
            animation: "fadeSlideIn 0.6s ease both",
          }}>
            {/* Tab switcher */}
            <div style={{
              display: "flex",
              gap: 4,
              background: "rgba(255,255,255,0.07)",
              borderRadius: 12,
              padding: 4,
              marginBottom: 28,
            }}>
              {(["login", "signup"] as Tab[]).map((t) => (
                <button
                  key={t}
                  onClick={() => setTab(t)}
                  style={{
                    flex: 1,
                    padding: "9px 0",
                    borderRadius: 9,
                    border: "none",
                    background: tab === t ? "rgba(255,255,255,0.15)" : "none",
                    color: tab === t ? "#fff" : "rgba(255,255,255,0.45)",
                    fontSize: 14,
                    fontWeight: tab === t ? 600 : 400,
                    fontFamily: "'DM Sans', sans-serif",
                    cursor: "pointer",
                    transition: "all 0.2s",
                    boxShadow: tab === t ? "0 2px 8px rgba(0,0,0,0.2)" : "none",
                  }}
                >
                  {t === "login" ? "Đăng nhập" : "Đăng ký"}
                </button>
              ))}
            </div>

            {/* Greeting */}
            <div style={{ marginBottom: 22 }}>
              <h2 style={{
                color: "#fff",
                fontSize: 22,
                fontWeight: 700,
                fontFamily: "'Syne', sans-serif",
                marginBottom: 4,
              }}>
                {tab === "login" ? "Chào mừng trở lại 👋" : "Tạo tài khoản mới ✨"}
              </h2>
              <p style={{ color: "rgba(255,255,255,0.45)", fontSize: 13 }}>
                {tab === "login"
                  ? "Đăng nhập để tiếp tục trò chuyện"
                  : "Tham gia ChatApp ngay hôm nay"}
              </p>
            </div>

            {/* Form content */}
            <div key={tab} style={{ animation: "formFade 0.25s ease both" }}>
              {tab === "login" ? <LoginForm /> : <SignupForm />}
            </div>

            {/* Divider */}
            <div style={{ display: "flex", alignItems: "center", gap: 12, margin: "20px 0" }}>
              <div style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.1)" }} />
              <span style={{ color: "rgba(255,255,255,0.3)", fontSize: 12 }}>hoặc</span>
              <div style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.1)" }} />
            </div>

            {/* Switch tab hint */}
            <p style={{ textAlign: "center", color: "rgba(255,255,255,0.4)", fontSize: 13 }}>
              {tab === "login" ? "Chưa có tài khoản? " : "Đã có tài khoản? "}
              <button
                onClick={() => setTab(tab === "login" ? "signup" : "login")}
                style={{
                  background: "none", border: "none",
                  color: "#2dd4bf", fontSize: 13, fontWeight: 600,
                  cursor: "pointer", fontFamily: "'DM Sans', sans-serif",
                }}
              >
                {tab === "login" ? "Đăng ký ngay" : "Đăng nhập"}
              </button>
            </p>
          </div>

          {/* Right — Hero text */}
          <div style={{ flex: 1, maxWidth: 480, animation: "fadeSlideIn 0.7s 0.15s ease both", opacity: 0 }}>
            {/* Badge */}
            <div style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 7,
              background: "rgba(45,212,191,0.12)",
              border: "1px solid rgba(45,212,191,0.3)",
              borderRadius: 100,
              padding: "5px 14px",
              marginBottom: 22,
            }}>
              <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#2dd4bf", boxShadow: "0 0 8px #2dd4bf" }} />
              <span style={{ color: "#2dd4bf", fontSize: 12, fontWeight: 500 }}>Nhắn tin thời gian thực</span>
            </div>

            <h1 style={{
              color: "#fff",
              fontSize: 52,
              fontWeight: 800,
              fontFamily: "'Syne', sans-serif",
              lineHeight: 1.1,
              marginBottom: 20,
              letterSpacing: "-1px",
            }}>
              Kết nối mọi<br />
              <span style={{
                background: "linear-gradient(135deg, #2dd4bf, #0ea5e9)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}>
                người thân yêu
              </span>
            </h1>

            <p style={{
              color: "rgba(255,255,255,0.5)",
              fontSize: 16,
              lineHeight: 1.7,
              marginBottom: 36,
              maxWidth: 380,
            }}>
              Trò chuyện, chia sẻ khoảnh khắc và duy trì kết nối với bạn bè, gia đình mọi lúc mọi nơi.
            </p>

            {/* Stats */}
            <div style={{ display: "flex", gap: 36 }}>
              {[
                { num: "10K+", label: "Người dùng" },
                { num: "99.9%", label: "Uptime" },
                { num: "< 50ms", label: "Độ trễ" },
              ].map(({ num, label }) => (
                <div key={label}>
                  <div style={{ color: "#fff", fontSize: 22, fontWeight: 700, fontFamily: "'Syne', sans-serif" }}>{num}</div>
                  <div style={{ color: "rgba(255,255,255,0.4)", fontSize: 13, marginTop: 2 }}>{label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
