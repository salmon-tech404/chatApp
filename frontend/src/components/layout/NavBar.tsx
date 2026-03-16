import { useNavigate } from "react-router";
import AppLogo from "@/components/common/AppLogo.tsx";
import GradientButton from "@/components/common/GradientButton.tsx";
import styles from "@/styles/navbar.module.css";

const NAV_LINKS = [
  { name: "Tính năng", path: "/" },
  { name: "Về chúng tôi", path: "/" },
  { name: "Liên hệ", path: "/" },
];

export default function NavBar() {
  const navigate = useNavigate();
  return (
    <nav className={styles.navbar}>
      <AppLogo asLink />

      <div className={styles.navLinks}>
        {NAV_LINKS.map((link) => (
          <button
            key={link.name}
            className={styles.navLink}
            onClick={() => navigate(link.path)}
          >
            {link.name}
          </button>
        ))}
      </div>

      <div className={styles.navActions}>
        <GradientButton
          variant='ghost'
          size='sm'
          onClick={() => navigate("/login")}
        >
          Đăng nhập
        </GradientButton>
        <GradientButton
          variant='outline'
          size='sm'
          onClick={() => navigate("/signup")}
        >
          Đăng ký
        </GradientButton>
      </div>
    </nav>
  );
}
