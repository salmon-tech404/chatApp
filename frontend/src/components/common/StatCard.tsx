// src/components/common/StatCard.tsx
//
// Hiển thị một chỉ số thống kê: con số lớn + label + mô tả
// Tái sử dụng: About page, có thể dùng cho Landing page, Dashboard

import styles from "./StatCard.module.css";

interface StatCardProps {
  value: string;
  label: string;
  description?: string;
  /** Icon hoặc emoji trang trí phía trên */
  icon?: React.ReactNode;
}

export default function StatCard({
  value,
  label,
  description,
  icon,
}: StatCardProps) {
  return (
    <div className={styles.card}>
      {icon && <div className={styles.icon}>{icon}</div>}
      <div className={styles.value}>{value}</div>
      <div className={styles.label}>{label}</div>
      {description && (
        <div className={styles.description}>{description}</div>
      )}
    </div>
  );
}
