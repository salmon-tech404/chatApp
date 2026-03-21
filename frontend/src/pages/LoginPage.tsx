import PageWrapper from "@/components/layout/PageWrapper";
import Navbar from "@/components/layout/NavBar";
import AuthLayout from "@/components/layout/AuthLayout";
import LoginForm from "@/components/auth/LoginForm";

export default function LoginPage() {
  return (
    <PageWrapper>
      <Navbar />
      <AuthLayout
        title='Chào mừng trở lại 👋'
        subtitle='Đăng nhập để tiếp tục cuộc trò chuyện và kết nối với mọi người xung quanh bạn.'
      >
        <LoginForm />
      </AuthLayout>
    </PageWrapper>
  );
}
