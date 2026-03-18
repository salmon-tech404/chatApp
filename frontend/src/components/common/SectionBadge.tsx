// src/components/common/SectionBadge.tsx
//
// Badge nhỏ hiển thị label cho mỗi section
// Tái sử dụng ở About, Contact, và bất kỳ trang nào cần

import styles from "./SectionBadge.module.css";

interface SectionBadgeProps {
  label: string;
  /** Hiện dot nhấp nháy — dùng cho các section "live" hoặc highlight */
  pulseDot?: boolean;
}

export default function SectionBadge({
  label,
  pulseDot = false,
}: SectionBadgeProps) {
  return (
    <div className={styles.badge}>
      {pulseDot && <span className={styles.dot} aria-hidden="true" />}
      <span className={styles.label}>{label}</span>
    </div>
  );
}
