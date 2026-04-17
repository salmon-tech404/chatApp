import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod"; //Schema Validation
import { useNavigate, Link } from "react-router";
import { User, Mail, Lock, ArrowRight } from "lucide-react";
import { toast } from "sonner";
import api from "@/lib/axios";
import { isAxiosError } from "axios";
import AuthInputField from "@/components/common/AuthInputField";

// Tạo schema validation cho form đăng ký bằng zod
const SignupSchema = z.object({
  firstname: z
    .string()
    .regex(/^[a-zA-ZÀ-ỹ\s]+$/, "Họ chỉ được chứa ký tự chữ và khoảng trắng")
    .min(1, "Vui lòng nhập họ"),
  lastname: z
    .string()
    .regex(/^[a-zA-ZÀ-ỹ\s]+$/, "Tên chỉ được chứa ký tự chữ và khoảng trắng")
    .min(1, "Vui lòng nhập tên"),
  username: z.string().min(1, "Vui lòng nhập username"),
  email: z.string().min(1, "Vui lòng nhập email").email("Email không hợp lệ"),
  password: z
    .string()
    .min(1, "Vui lòng nhập mật khẩu")
    .min(6, "Mật khẩu phải có ít nhất 6 ký tự"),
});

// Định nghĩa kiểu dữ liệu cho form dựa trên schema
type SignupFormData = z.infer<typeof SignupSchema>;

// Component chính của form đăng ký
export default function SignupForm() {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignupFormData>({
    //useForm công cụ giúp bạn xử lý input, validate, submit, lỗi form mà không phải tự viết logic thủ công
    resolver: zodResolver(SignupSchema),
  });

  const onSubmit = async (data: SignupFormData) => {
    try {
      await api.post("auth/signup", data);
      toast.success("Đăng ký thành công! 🎉");
      navigate("/login");
    } catch (err: unknown) {
      const message =
        isAxiosError(err) && err.response?.data?.message
          ? err.response.data.message
          : "Đăng ký thất bại, thử lại nhé!";
      toast.error(message);
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
        Đăng ký
      </h2>
      <p
        style={{
          color: "rgba(255,255,255,0.4)",
          fontSize: 14,
          marginBottom: 28,
        }}
      >
        Tạo tài khoản mới
      </p>

      <form
        onSubmit={handleSubmit(onSubmit)}
        style={{ display: "flex", flexDirection: "column", gap: 14 }}
      >
        {/* Họ và Tên — 2 cột cạnh nhau */}

        <AuthInputField
          icon={User}
          placeholder='Họ'
          error={errors.firstname?.message}
          {...register("firstname")}
        />
        <AuthInputField
          icon={User}
          placeholder='Tên'
          error={errors.lastname?.message}
          {...register("lastname")}
        />

        {/* Username */}
        <AuthInputField
          icon={User}
          placeholder='Username'
          error={errors.username?.message}
          {...register("username")}
        />

        {/* Email */}
        <AuthInputField
          icon={Mail}
          placeholder='Email'
          error={errors.email?.message}
          {...register("email")}
        />

        {/* Mật khẩu */}
        <AuthInputField
          icon={Lock}
          placeholder='Mật khẩu (tối thiểu 6 ký tự)'
          type='password'
          error={errors.password?.message}
          {...register("password")}
        />

        {/* Nút submit */}
        <button
          type='submit'
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
            padding: "14px 0",
            color: "#fff",
            fontSize: 15,
            fontWeight: 600,
            fontFamily: "var(--font-body)",
            cursor: isSubmitting ? "not-allowed" : "pointer",
            marginTop: 4,
            boxShadow: "0 4px 20px rgba(45,212,191,0.35)",
            transition: "opacity 0.2s, transform 0.15s",
          }}
        >
          {isSubmitting ? (
            "Đang đăng ký..."
          ) : (
            <>
              {" "}
              Đăng ký <ArrowRight size={16} />{" "}
            </>
          )}
        </button>
      </form>

      {/* Divider */}
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

      {/* Link chuyển sang đăng nhập */}
      <p
        style={{
          textAlign: "center",
          color: "rgba(255,255,255,0.4)",
          fontSize: 14,
        }}
      >
        Đã có tài khoản?{" "}
        <Link
          to='/login'
          style={{ color: "#2dd4bf", fontWeight: 600, textDecoration: "none" }}
        >
          Đăng nhập
        </Link>
      </p>
    </>
  );
}
