import { type HTMLAttributes } from "react";

type BadgeVariant = "gold" | "muted" | "success" | "warning" | "danger";

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
}

const variants: Record<BadgeVariant, string> = {
  gold: "bg-gold/15 text-gold border-gold/30",
  muted: "bg-white/5 text-gray-400 border-white/10",
  success: "bg-green-900/30 text-green-400 border-green-800/50",
  warning: "bg-yellow-900/30 text-yellow-400 border-yellow-800/50",
  danger: "bg-red-900/30 text-red-400 border-red-800/50",
};

export function Badge({
  className = "",
  variant = "muted",
  children,
  ...props
}: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-medium ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </span>
  );
}
