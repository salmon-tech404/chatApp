import { type ReactNode } from "react";
import styles from "./PageWrapper.module.css";

interface PageWrapperProps {
  children: ReactNode;
  /**
   * Thêm class tùy chỉnh từ bên ngoài nếu cần override
   */
  className?: string;
}

/**
 * PageWrapper
 * – Bọc toàn bộ trang với background gradient cố định
 * – Render các bubble trang trí nền
 * – Đảm bảo min-height: 100vh + overflow hidden cho mọi page
 */
export default function PageWrapper({ children, className }: PageWrapperProps) {
  return (
    <div className={`${styles.root} ${className ?? ""}`}>
      {/* Background mesh glow */}
      <div className={styles.meshTop}    aria-hidden="true" />
      <div className={styles.meshBottom} aria-hidden="true" />

      {/* Floating bubbles */}
      <div className={`${styles.bubble} ${styles.bubble1}`} aria-hidden="true" />
      <div className={`${styles.bubble} ${styles.bubble2}`} aria-hidden="true" />
      <div className={`${styles.bubble} ${styles.bubble3}`} aria-hidden="true" />
      <div className={`${styles.bubble} ${styles.bubble4}`} aria-hidden="true" />
      <div className={`${styles.bubble} ${styles.bubble5}`} aria-hidden="true" />

      {/* Page content sits above decorations */}
      <div className={styles.content}>
        {children}
      </div>
    </div>
  );
}
