import { useState, forwardRef } from "react";
import { Eye, EyeOff, type LucideIcon } from "lucide-react";

interface AuthInputFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  icon: LucideIcon;
  error?: string;
}

// forwardRef để react-hook-form có thể gắn ref vào input bên trong
const AuthInputField = forwardRef<HTMLInputElement, AuthInputFieldProps>(
  ({ icon: Icon, error, type = "text", ...rest }, ref) => {
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
            color={
              error ? "#f87171" : focused ? "#fff" : "rgba(255,255,255,0.5)"
            }
            style={{ flexShrink: 0 }}
          />
          <input
            ref={ref}
            type={isPassword && showPassword ? "text" : type}
            onFocus={() => setFocused(true)}
            onBlur={(e) => {
              setFocused(false);
              rest.onBlur?.(e); // giữ lại onBlur của react-hook-form
            }}
            style={{
              flex: 1,
              background: "none",
              border: "none",
              outline: "none",
              color: "#fff",
              fontSize: 14,
              fontFamily: "var(--font-body)",
            }}
            {...rest}
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
                <Eye size={15} color='rgba(255,255,255,0.4)' />
              ) : (
                <EyeOff size={15} color='rgba(255,255,255,0.4)' />
              )}
            </button>
          )}
        </div>
        {error && (
          <span style={{ color: "#f87171", fontSize: 12, paddingLeft: 4 }}>
            {error}
          </span>
        )}
      </div>
    );
  },
);

export default AuthInputField;
