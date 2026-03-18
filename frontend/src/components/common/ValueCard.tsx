// src/components/common/ValueCard.tsx
//
// Card hiển thị một giá trị cốt lõi / tính năng nổi bật
// Có icon, tiêu đề, mô tả — layout dọc
// Tái sử dụng: About (Values), có thể dùng cho Features, Contact (reasons)

import styles from "./ValueCard.module.css";

interface ValueCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  /** Màu accent cho icon box — mặc định dùng teal brand */
  accentColor?: string;
}

export default function ValueCard({
  icon,
  title,
  description,
  accentColor = "rgba(45, 212, 191, 0.12)",
}: ValueCardProps) {
  return (
    <div className={styles.card}>
      <div
        className={styles.iconBox}
        style={{ background: accentColor }}
      >
        {icon}
      </div>
      <h3 className={styles.title}>{title}</h3>
      <p className={styles.description}>{description}</p>
    </div>
  );
}
