// src/components/common/SectionHeader.tsx
//
// Pattern tiêu đề section lặp đi lặp lại: badge → heading → subtitle
// Dùng ở mọi section của About, Contact, và các trang sau này
// Hỗ trợ căn giữa hoặc căn trái

import SectionBadge from "./SectionBadge";
import styles from "./SectionHeader.module.css";

interface SectionHeaderProps {
  badge?: string;
  badgePulseDot?: boolean;
  title: string;
  /** Cho phép highlight một đoạn text trong title bằng gradient */
  highlightedTitle?: string;
  subtitle?: string;
  align?: "left" | "center";
}

export default function SectionHeader({
  badge,
  badgePulseDot = false,
  title,
  highlightedTitle,
  subtitle,
  align = "center",
}: SectionHeaderProps) {
  return (
    <div className={styles.wrapper} data-align={align}>
      {badge && (
        <div className={styles.badgeWrapper}>
          <SectionBadge label={badge} pulseDot={badgePulseDot} />
        </div>
      )}

      <h2 className={styles.title}>
        {title}{" "}
        {highlightedTitle && (
          <span className="gradient-text">{highlightedTitle}</span>
        )}
      </h2>

      {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
    </div>
  );
}
