import { useLocation, useNavigate } from "react-router";
import AppLogo from "@/components/common/AppLogo.tsx";
import GradientButton from "@/components/common/GradientButton.tsx";
import styles from "@/styles/navbar.module.css";

const NAV_LINKS = [
  { name: "Trang chủ", path: "/" },
  { name: "Về chúng tôi", path: "/about" },
  { name: "Liên hệ", path: "/contact" },
];

export default function NavBar() {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <nav className={styles.navbar}>
      <AppLogo asLink />

      <div className={styles.navLinks}>
        {NAV_LINKS.map((link) => (
          <button
            key={link.name}
            className={`${styles.navLink} ${
              location.pathname === link.path ? styles.navLinkActive : ""
            }`}
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
