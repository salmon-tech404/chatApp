import { useState } from "react";
import { useLocation, useNavigate } from "react-router";
import AppLogo from "@/components/common/AppLogo.tsx";
import GradientButton from "@/components/common/GradientButton.tsx";
import styles from "@/styles/navbar.module.css";
import { useAuthStore } from "@/store/useAuthStore";
import { Menu, X } from "lucide-react";

const NAV_LINKS = [
  { name: "Trang chủ", path: "/" },
  { name: "Về chúng tôi", path: "/about" },
  { name: "Liên hệ", path: "/contact" },
];

export default function NavBar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuthStore();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleNav = (path: string) => { navigate(path); setMenuOpen(false); };

  return (
    <>
      <nav className={styles.navbar}>
        <AppLogo asLink />

        <div className={styles.navLinks}>
          {NAV_LINKS.map((link) => (
            <button
              key={link.name}
              className={`${styles.navLink} ${location.pathname === link.path ? styles.navLinkActive : ""}`}
              onClick={() => handleNav(link.path)}
            >
              {link.name}
            </button>
          ))}
        </div>

        <div className={styles.navActions}>
          <div className={styles.desktopActions}>
            {user ? (
              <GradientButton variant='primary' size='sm' onClick={() => navigate("/chat")}>
                Mở chat
              </GradientButton>
            ) : (
              <>
                <GradientButton variant='ghost' size='sm' onClick={() => navigate("/login")}>
                  Đăng nhập
                </GradientButton>
                <GradientButton variant='outline' size='sm' onClick={() => navigate("/signup")}>
                  Đăng ký
                </GradientButton>
              </>
            )}
          </div>
          <button
            className={styles.hamburger}
            onClick={() => setMenuOpen((v) => !v)}
            aria-label='Menu'
          >
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </nav>

      {menuOpen && (
        <div className={styles.mobileMenu}>
          {NAV_LINKS.map((link) => (
            <button
              key={link.name}
              className={`${styles.mobileNavLink} ${location.pathname === link.path ? styles.mobileNavLinkActive : ""}`}
              onClick={() => handleNav(link.path)}
            >
              {link.name}
            </button>
          ))}
          <div className={styles.mobileMenuActions}>
            {user ? (
              <GradientButton variant='primary' size='md' onClick={() => handleNav("/chat")}>
                Mở chat
              </GradientButton>
            ) : (
              <>
                <GradientButton variant='ghost' size='md' onClick={() => handleNav("/login")}>
                  Đăng nhập
                </GradientButton>
                <GradientButton variant='outline' size='md' onClick={() => handleNav("/signup")}>
                  Đăng ký
                </GradientButton>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}
