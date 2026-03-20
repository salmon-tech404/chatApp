import { MessageCircle } from "lucide-react";
import { Link } from "react-router";
import styles from "./AppLogo.module.css";

interface AppLogoProps {
  size?: "sm" | "md" | "lg";
  asLink?: boolean;
}

const SIZE_MAP = {
  sm: { icon: 30, iconSize: 15, font: 15 },
  md: { icon: 38, iconSize: 19, font: 18 },
  lg: { icon: 52, iconSize: 26, font: 24 },
};

export default function AppLogo({ size = "md", asLink = false }: AppLogoProps) {
  const s = SIZE_MAP[size];

  const inner = (
    <div className={styles.wrapper}>
      <div
        className={styles.iconBox}
        style={{ width: s.icon, height: s.icon, borderRadius: s.icon * 0.26 }}
      >
        <MessageCircle size={s.iconSize} color='#fff' />
      </div>
      <span className={styles.name} style={{ fontSize: s.font }}>
        Halo App
      </span>
    </div>
  );

  if (asLink) {
    return (
      <Link to='/' className={styles.link}>
        {inner}
      </Link>
    );
  }

  return inner;
}
