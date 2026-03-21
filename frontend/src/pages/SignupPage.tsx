import PageWrapper from "@/components/layout/PageWrapper";
import Navbar from "@/components/layout/NavBar";
import AuthLayout from "@/components/layout/AuthLayout";
import SignupForm from "@/components/auth/SignupForm";

export default function SignupPage() {
  return (
    <PageWrapper>
      <Navbar />
      <AuthLayout
        title='Tạo tài khoản mới 🎉'
        subtitle='Đăng ký để bắt đầu hành trình kết nối với mọi người xung quanh bạn.'
      >
        <SignupForm />
      </AuthLayout>
    </PageWrapper>
  );
}
