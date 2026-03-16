// src/pages/SignupPage.tsx
//
// Trang đăng ký tài khoản mới
// – React Hook Form + Zod để validate
// – Kết nối backend POST /api/auth/signup
// – Sau khi đăng ký thành công → chuyển sang /login

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useNavigate, Link } from "react-router";
import { User, Mail, Lock, Eye, EyeOff, ArrowRight, MessageCircle, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import axios from "axios";

// ─── 1. Schema Zod cho form đăng ký ──────────────────────────────────────────
// .min() kiểm tra độ dài tối thiểu
// .email() kiểm tra định dạng email
// .refine() là custom validation (kiểm tra 2 password có khớp không)
const signupSchema = z
  .object({
    firstname: z.string().min(1, "Vui lòng nhập họ"),
    lastname: z.string().min(1, "Vui lòng nhập tên"),
    username: z
      .string()
      .min(3, "Username phải có ít nhất 3 ký tự")
      .regex(/^[a-zA-Z0-9_]+$/, "Chỉ dùng chữ, số và dấu gạch dưới"),
    email: z.string().email("Email không hợp lệ"),
    password: z.string().min(6, "Mật khẩu tối thiểu 6 ký tự"),
    confirmPassword: z.string().min(1, "Vui lòng xác nhận mật khẩu"),
  })
  // refine() thêm validation tùy chỉnh: kiểm tra 2 password có giống nhau không
  .refine((data) => data.password === data.confirmPassword, {
    message: "Mật khẩu không khớp",
    path: ["confirmPassword"], // lỗi này sẽ hiện ở field confirmPassword
  });

type SignupFormData = z.infer<typeof signupSchema>;

// ─── 2. InputField component (tương tự LoginPage) ─────────────────────────────
function InputField({
  icon: Icon,
  placeholder,
  type = "text",
  error,
  ...rest
}: {
  icon: React.ElementType;
  placeholder: string;
  type?: string;
  error?: string;
} & React.InputHTMLAttributes<HTMLInputElement>) {
  const [showPass, setShowPass] = useState(false);
  const [focused, setFocused] = useState(false);
  const isPassword = type === "password";

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
          background: focused ? "rgba(255,255,255,0.13)" : "rgba(255,255,255,0.07)",
          border: error
            ? "1px solid rgba(248,113,113,0.7)"
            : focused
            ? "1px solid rgba(45,212,191,0.6)"
            : "1px solid rgba(255,255,255,0.14)",
          borderRadius: 12,
          padding: "12px 16px",
          transition: "all 0.2s ease",
        }}
      >
        <Icon
          size={15}
          color={error ? "#f87171" : focused ? "#2dd4bf" : "rgba(255,255,255,0.35)"}
          style={{ flexShrink: 0, transition: "color 0.2s" }}
        />
        <input
          type={isPassword && showPass ? "text" : type}
          placeholder={placeholder}
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
          {...rest}
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPass(!showPass)}
            style={{ background: "none", border: "none", cursor: "pointer", padding: 0, display: "flex" }}
          >
            {showPass
              ? <EyeOff size={14} color="rgba(255,255,255,0.3)" />
              : <Eye size={14} color="rgba(255,255,255,0.3)" />
            }
          </button>
        )}
      </div>
      {error && (
        <span style={{ color: "#f87171", fontSize: 11.5, paddingLeft: 4 }}>{error}</span>
      )}
    </div>
  );
}

// ─── 3. Danh sách tính năng hiển thị bên trái ─────────────────────────────────
const FEATURES = [
  "Nhắn tin thời gian thực",
  "Mã hóa end-to-end an toàn",
  "Gửi file, ảnh, sticker",
  "Hoàn toàn miễn phí",
];

// ─── 4. Main Component SignupPage ─────────────────────────────────────────────
export default function SignupPage() {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
  });

  const onSubmit = async (data: SignupFormData) => {
    try {
      // Backend nhận: username, password, email, firstname, lastname
      await axios.post("http://localhost:5001/api/auth/signup", {
        username: data.username,
        password: data.password,
        email: data.email,
        firstname: data.firstname,
        lastname: data.lastname,
      });

      toast.success("Tạo tài khoản thành công! Hãy đăng nhập 🎉");

      // Chuyển về trang đăng nhập sau khi đăng ký thành công
      navigate("/login");
    } catch (err: unknown) {
      const message =
        axios.isAxiosError(err) && err.response?.data?.message
          ? err.response.data.message
          : "Đăng ký thất bại, thử lại nhé!";
      toast.error(message);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        position: "relative",
        overflow: "hidden",
        background: "linear-gradient(145deg, #0d2137 0%, #0a3d4a 48%, #083d38 100%)",
      }}
    >
      {/* ── Bong bóng nền ── */}
      {[
        { size: 380, x: "-110px", y: "-100px", delay: "0s",   opacity: 0.5 },
        { size: 200, x: "65%",    y: "-50px",  delay: "1.5s", opacity: 0.3 },
        { size: 160, x: "82%",    y: "60%",    delay: "3s",   opacity: 0.2 },
        { size: 260, x: "-40px",  y: "63%",    delay: "2.2s", opacity: 0.27 },
      ].map((b, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            width: b.size, height: b.size,
            left: b.x, top: b.y,
            borderRadius: "50%",
            background: "radial-gradient(circle at 30% 30%, rgba(255,255,255,0.1), rgba(255,255,255,0.02))",
            border: "1px solid rgba(255,255,255,0.07)",
            backdropFilter: "blur(2px)",
            opacity: b.opacity,
            animation: "floatBubble 7s ease-in-out infinite",
            animationDelay: b.delay,
            pointerEvents: "none",
          }}
        />
      ))}

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Syne:wght@700;800&display=swap');
        @keyframes floatBubble {
          0%, 100% { transform: translateY(0) scale(1); }
          50% { transform: translateY(-20px) scale(1.03); }
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(24px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        ::placeholder { color: rgba(255,255,255,0.3) !important; }
      `}</style>

      {/* ── Cột trái: Branding ── */}
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "60px 64px",
          position: "relative",
          zIndex: 1,
        }}
      >
        {/* Logo */}
        <Link
          to="/"
          style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none", marginBottom: 64 }}
        >
          <div
            style={{
              width: 40, height: 40,
              background: "linear-gradient(135deg, #2dd4bf, #0ea5e9)",
              borderRadius: 11,
              display: "flex", alignItems: "center", justifyContent: "center",
              boxShadow: "0 4px 16px rgba(45,212,191,0.4)",
            }}
          >
            <MessageCircle size={21} color="#fff" />
          </div>
          <span
            style={{
              color: "#fff", fontSize: 19, fontWeight: 700,
              fontFamily: "'Syne', sans-serif", letterSpacing: "-0.3px",
            }}
          >
            ChatApp
          </span>
        </Link>

        <div style={{ animation: "slideUp 0.7s ease both" }}>
          <h1
            style={{
              fontFamily: "'Syne', sans-serif",
              fontSize: "clamp(36px, 4vw, 50px)",
              fontWeight: 800,
              color: "#fff",
              lineHeight: 1.1,
              letterSpacing: "-1px",
              marginBottom: 18,
            }}
          >
            Tham gia ngay{" "}
            <span
              style={{
                background: "linear-gradient(135deg, #2dd4bf, #0ea5e9)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              miễn phí ✨
            </span>
          </h1>

          <p style={{ color: "rgba(255,255,255,0.45)", fontSize: 15, lineHeight: 1.7, maxWidth: 340, marginBottom: 40 }}>
            Tạo tài khoản để bắt đầu kết nối và trò chuyện với bạn bè.
          </p>

          {/* Danh sách tính năng với icon check */}
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {FEATURES.map((feat) => (
              <div key={feat} style={{ display: "flex", alignItems: "center", gap: 12 }}>
                {/* Icon check màu teal */}
                <CheckCircle2 size={18} color="#2dd4bf" style={{ flexShrink: 0 }} />
                <span style={{ color: "rgba(255,255,255,0.65)", fontSize: 14, fontFamily: "'DM Sans', sans-serif" }}>
                  {feat}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Cột phải: Form đăng ký ── */}
      <div
        style={{
          width: 480,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "32px 40px 32px 0",
          position: "relative",
          zIndex: 1,
        }}
      >
        <div
          style={{
            width: "100%",
            background: "rgba(255,255,255,0.06)",
            backdropFilter: "blur(28px)",
            border: "1px solid rgba(255,255,255,0.12)",
            borderRadius: 24,
            padding: "36px 32px",
            boxShadow: "0 24px 60px rgba(0,0,0,0.35)",
            animation: "slideUp 0.6s ease both",
          }}
        >
          <h2
            style={{
              fontFamily: "'Syne', sans-serif",
              fontSize: 22, fontWeight: 700,
              color: "#fff", marginBottom: 4,
            }}
          >
            Tạo tài khoản
          </h2>
          <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 13, marginBottom: 24 }}>
            Điền thông tin bên dưới để bắt đầu
          </p>

          {/* Form */}
          <form
            onSubmit={handleSubmit(onSubmit)}
            style={{ display: "flex", flexDirection: "column", gap: 13 }}
          >
            {/* Họ và Tên trên cùng 1 hàng (2 cột) */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <InputField
                icon={User}
                placeholder="Họ"
                error={errors.firstname?.message}
                {...register("firstname")}
              />
              <InputField
                icon={User}
                placeholder="Tên"
                error={errors.lastname?.message}
                {...register("lastname")}
              />
            </div>

            {/* Username */}
            <InputField
              icon={User}
              placeholder="Username (vd: nguyen_van_a)"
              error={errors.username?.message}
              {...register("username")}
            />

            {/* Email */}
            <InputField
              icon={Mail}
              placeholder="Email"
              type="email"
              error={errors.email?.message}
              {...register("email")}
            />

            {/* Password */}
            <InputField
              icon={Lock}
              placeholder="Mật khẩu (tối thiểu 6 ký tự)"
              type="password"
              error={errors.password?.message}
              {...register("password")}
            />

            {/* Confirm Password */}
            <InputField
              icon={Lock}
              placeholder="Xác nhận mật khẩu"
              type="password"
              error={errors.confirmPassword?.message}
              {...register("confirmPassword")}
            />

            {/* Điều khoản */}
            <p style={{ color: "rgba(255,255,255,0.3)", fontSize: 11.5, lineHeight: 1.6, textAlign: "center" }}>
              Bằng cách đăng ký, bạn đồng ý với{" "}
              <span style={{ color: "#2dd4bf", cursor: "pointer" }}>Điều khoản</span> và{" "}
              <span style={{ color: "#2dd4bf", cursor: "pointer" }}>Chính sách bảo mật</span>.
            </p>

            {/* Nút submit */}
            <button
              type="submit"
              disabled={isSubmitting}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 8,
                background: isSubmitting
                  ? "rgba(45,212,191,0.4)"
                  : "linear-gradient(135deg, #2dd4bf, #0ea5e9)",
                border: "none",
                borderRadius: 12,
                padding: "13px 0",
                color: "#fff",
                fontSize: 15,
                fontWeight: 600,
                fontFamily: "'DM Sans', sans-serif",
                cursor: isSubmitting ? "not-allowed" : "pointer",
                boxShadow: "0 4px 20px rgba(45,212,191,0.35)",
                transition: "opacity 0.2s, transform 0.15s",
                marginTop: 2,
              }}
            >
              {isSubmitting ? "Đang tạo tài khoản..." : (
                <>Tạo tài khoản <ArrowRight size={16} /></>
              )}
            </button>
          </form>

          {/* Divider */}
          <div style={{ display: "flex", alignItems: "center", gap: 12, margin: "20px 0" }}>
            <div style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.08)" }} />
            <span style={{ color: "rgba(255,255,255,0.25)", fontSize: 12 }}>hoặc</span>
            <div style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.08)" }} />
          </div>

          {/* Link chuyển sang login */}
          <p style={{ textAlign: "center", color: "rgba(255,255,255,0.4)", fontSize: 14 }}>
            Đã có tài khoản?{" "}
            <Link
              to="/login"
              style={{ color: "#2dd4bf", fontWeight: 600, textDecoration: "none" }}
            >
              Đăng nhập
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
