import { type ButtonHTMLAttributes, type ReactNode } from "react";
import styles from "./GradientButton.module.css";
import { cn } from "@/lib/utils";

type Variant = "primary" | "outline" | "ghost";
type Size    = "sm" | "md" | "lg";

interface GradientButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?:    Size;
  icon?:    ReactNode;
  iconPosition?: "left" | "right";
  children: ReactNode;
}

export default function GradientButton({
  variant      = "primary",
  size         = "md",
  icon,
  iconPosition = "right",
  children,
  className,
  ...props
}: GradientButtonProps) {
  return (
    <button
      className={cn(
        styles.base,
        styles[variant],
        styles[size],
        className,
      )}
      {...props}
    >
      {icon && iconPosition === "left"  && <span className={styles.icon}>{icon}</span>}
      <span>{children}</span>
      {icon && iconPosition === "right" && <span className={styles.icon}>{icon}</span>}
    </button>
  );
}
