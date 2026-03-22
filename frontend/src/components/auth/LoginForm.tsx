import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useNavigate, Link } from "react-router";
import { Mail, Lock, ArrowRight } from "lucide-react";
import AuthInputField from "@/components/common/AuthInputField";
import { useAuthStore } from "@/store/useAuthStore";

const loginSchema = z.object({
  username: z.string().min(1, "Vui lòng nhập username"),
  password: z.string().min(1, "Vui lòng nhập mật khẩu"),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginForm() {
  const navigate = useNavigate();
  // Lấy Signin & Loading từ Store
  const { signIn, loading } = useAuthStore();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      await signIn(data.username, data.password);
      // Điều hướng về trang chủ sau khi đăng nhập thành công
      navigate("/chat");
    } catch {
      // Lỗi đã được xử lý và hiển thị trong Store, không cần làm gì thêm ở đây
    }
  };

  return (
    <>
      <h2
        style={{
          fontFamily: "var(--font-display)",
          fontSize: 24,
          fontWeight: 700,
          color: "#fff",
          marginBottom: 6,
        }}
      >
        Đăng nhập
      </h2>
      <p
        style={{
          color: "rgba(255,255,255,0.4)",
          fontSize: 14,
          marginBottom: 28,
        }}
      >
        Nhập thông tin tài khoản của bạn
      </p>

      <form
        onSubmit={handleSubmit(onSubmit)}
        style={{ display: "flex", flexDirection: "column", gap: 16 }}
      >
        <AuthInputField
          icon={Mail}
          placeholder='Username'
          error={errors.username?.message}
          {...register("username")}
        />

        <div>
          <AuthInputField
            icon={Lock}
            placeholder='Mật khẩu'
            type='password'
            error={errors.password?.message}
            {...register("password")}
          />
          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              marginTop: 8,
            }}
          >
            <button
              type='button'
              style={{
                background: "none",
                border: "none",
                color: "rgba(255,255,255,0.45)",
                fontSize: 12,
                cursor: "pointer",
                fontFamily: "var(--font-body)",
              }}
            >
              Quên mật khẩu?
            </button>
          </div>
        </div>

        <button
          type='submit'
          disabled={loading}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 8,
            background: loading
              ? "rgba(45,212,191,0.4)"
              : "linear-gradient(135deg, #2dd4bf, #0ea5e9)",
            border: "none",
            borderRadius: 12,
            padding: "14px 0",
            color: "#fff",
            fontSize: 15,
            fontWeight: 600,
            fontFamily: "var(--font-body)",
            cursor: loading ? "not-allowed" : "pointer",
            marginTop: 4,
            boxShadow: "0 4px 20px rgba(45,212,191,0.35)",
            transition: "opacity 0.2s, transform 0.15s",
          }}
        >
          {loading ? (
            "Đang đăng nhập..."
          ) : (
            <>
              Đăng nhập <ArrowRight size={16} />
            </>
          )}
        </button>
      </form>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 12,
          margin: "24px 0",
        }}
      >
        <div
          style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.08)" }}
        />
        <span style={{ color: "rgba(255,255,255,0.25)", fontSize: 12 }}>
          hoặc
        </span>
        <div
          style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.08)" }}
        />
      </div>

      <p
        style={{
          textAlign: "center",
          color: "rgba(255,255,255,0.4)",
          fontSize: 14,
        }}
      >
        Chưa có tài khoản?{" "}
        <Link
          to='/signup'
          style={{ color: "#2dd4bf", fontWeight: 600, textDecoration: "none" }}
        >
          Đăng ký ngay
        </Link>
      </p>
    </>
  );
}
