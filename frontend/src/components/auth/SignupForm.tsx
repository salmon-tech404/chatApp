import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useNavigate, Link } from "react-router";
import { User, Mail, Lock, ArrowRight, Check } from "lucide-react";
import { toast } from "sonner";
import api from "@/lib/axios";
import { isAxiosError } from "axios";
import AuthInputField from "@/components/common/AuthInputField";

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
    .min(6, "Mật khẩu phải có ít nhất 6 ký tự")
    .regex(/[A-Z]/, "Mật khẩu phải có ít nhất 1 chữ hoa")
    .regex(/[a-z]/, "Mật khẩu phải có ít nhất 1 chữ thường")
    .regex(/[^a-zA-Z0-9]/, "Mật khẩu phải có ít nhất 1 ký tự đặc biệt"),
});

type SignupFormData = z.infer<typeof SignupSchema>;

const requirements = [
  { key: "length",  label: "Ít nhất 6 ký tự",       test: (v: string) => v.length >= 6 },
  { key: "upper",   label: "Có chữ hoa (A–Z)",        test: (v: string) => /[A-Z]/.test(v) },
  { key: "lower",   label: "Có chữ thường (a–z)",     test: (v: string) => /[a-z]/.test(v) },
  { key: "special", label: "Có ký tự đặc biệt (!@#…)", test: (v: string) => /[^a-zA-Z0-9]/.test(v) },
];

export default function SignupForm() {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<SignupFormData>({
    resolver: zodResolver(SignupSchema),
    defaultValues: { password: "" },
  });

  const passwordValue = useWatch({ control, name: "password", defaultValue: "" });

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
        style={{ fontFamily: "var(--font-display)", fontSize: 24, fontWeight: 700, color: "#fff", marginBottom: 6 }}
      >
        Đăng ký
      </h2>
      <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 14, marginBottom: 28 }}>
        Tạo tài khoản mới
      </p>

      <form onSubmit={handleSubmit(onSubmit)} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        <AuthInputField icon={User} placeholder="Họ"       error={errors.firstname?.message} {...register("firstname")} />
        <AuthInputField icon={User} placeholder="Tên"      error={errors.lastname?.message}  {...register("lastname")} />
        <AuthInputField icon={User} placeholder="Username" error={errors.username?.message}  {...register("username")} />
        <AuthInputField icon={Mail} placeholder="Email"    error={errors.email?.message}     {...register("email")} />

        {/* Password + requirements */}
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          <AuthInputField
            icon={Lock}
            placeholder="Mật khẩu"
            type="password"
            error={errors.password?.message}
            {...register("password")}
          />

          {/* Live requirement checklist */}
          <div style={{ display: "flex", flexDirection: "column", gap: 4, paddingLeft: 4 }}>
            {requirements.map((r) => {
              const ok = r.test(passwordValue);
              return (
                <div key={r.key} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <div style={{
                    width: 14, height: 14, borderRadius: "50%", flexShrink: 0,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    background: ok ? "rgba(45,212,191,0.25)" : "rgba(255,255,255,0.08)",
                    border: ok ? "1px solid rgba(45,212,191,0.6)" : "1px solid rgba(255,255,255,0.15)",
                    transition: "all 0.2s ease",
                  }}>
                    {ok && <Check size={8} color="#2dd4bf" strokeWidth={3} />}
                  </div>
                  <span style={{
                    fontSize: 12,
                    color: ok ? "#2dd4bf" : "rgba(255,255,255,0.4)",
                    transition: "color 0.2s ease",
                  }}>
                    {r.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          style={{
            display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
            background: isSubmitting ? "rgba(45,212,191,0.4)" : "linear-gradient(135deg, #2dd4bf, #0ea5e9)",
            border: "none", borderRadius: 12, padding: "14px 0",
            color: "#fff", fontSize: 15, fontWeight: 600, fontFamily: "var(--font-body)",
            cursor: isSubmitting ? "not-allowed" : "pointer",
            marginTop: 4,
            boxShadow: "0 4px 20px rgba(45,212,191,0.35)",
            transition: "opacity 0.2s, transform 0.15s",
          }}
        >
          {isSubmitting ? "Đang đăng ký..." : <> Đăng ký <ArrowRight size={16} /> </>}
        </button>
      </form>

      <div style={{ display: "flex", alignItems: "center", gap: 12, margin: "24px 0" }}>
        <div style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.08)" }} />
        <span style={{ color: "rgba(255,255,255,0.25)", fontSize: 12 }}>hoặc</span>
        <div style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.08)" }} />
      </div>

      <p style={{ textAlign: "center", color: "rgba(255,255,255,0.4)", fontSize: 14 }}>
        Đã có tài khoản?{" "}
        <Link to="/login" style={{ color: "#2dd4bf", fontWeight: 600, textDecoration: "none" }}>
          Đăng nhập
        </Link>
      </p>
    </>
  );
}
