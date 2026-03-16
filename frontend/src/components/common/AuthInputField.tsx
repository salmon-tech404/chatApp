import { useState } from "react";
import { Eye, EyeOff, type LucideIcon } from "lucide-react";

interface AuthInputFieldProps {
  icon: LucideIcon;
  placeholder: string;
  type?: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
}

export default function AuthInputField({
  icon: Icon,
  placeholder,
  type = "text",
  value,
  onChange,
  error,
}: AuthInputFieldProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [focused, setFocused] = useState(false);
  const isPassword = type === "password";

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
          background: focused
            ? "rgba(255,255,255,0.14)"
            : "rgba(255,255,255,0.08)",
          border: error
            ? "1px solid rgba(248,113,113,0.7)"
            : focused
              ? "1px solid rgba(255,255,255,0.5)"
              : "1px solid rgba(255,255,255,0.18)",
          borderRadius: 12,
          padding: "12px 16px",
          transition: "all 0.25s ease",
        }}
      >
        <Icon
          size={16}
          color={error ? "#f87171" : focused ? "#fff" : "rgba(255,255,255,0.5)"}
          style={{ flexShrink: 0 }}
        />
        <input
          type={isPassword && showPassword ? "text" : type}
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          style={{
            flex: 1,
            background: "none",
            border: "none",
            outline: "none",
            color: "#fff",
            fontSize: 14,
            fontFamily: "var(--font-body)",
          }}
        />
        {isPassword && (
          <button
            type='button'
            onClick={() => setShowPassword(!showPassword)}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: 0,
              display: "flex",
            }}
          >
            {showPassword ? (
              <EyeOff size={15} color='rgba(255,255,255,0.4)' />
            ) : (
              <Eye size={15} color='rgba(255,255,255,0.4)' />
            )}
          </button>
        )}
      </div>

      {/* Hiện lỗi nếu có */}
      {error && (
        <span style={{ color: "#f87171", fontSize: 12, paddingLeft: 4 }}>
          {error}
        </span>
      )}
    </div>
  );
}
