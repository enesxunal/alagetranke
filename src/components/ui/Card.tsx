import { type HTMLAttributes } from "react";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  hover?: boolean;
}

export function Card({
  className = "",
  hover = false,
  children,
  ...props
}: CardProps) {
  return (
    <div
      className={`rounded-xl glass-panel p-5 ${hover ? "transition-all duration-300 hover:border-gold/40 hover:shadow-lg hover:shadow-gold/5" : ""} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardHeader({
  className = "",
  children,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={`mb-4 ${className}`} {...props}>
      {children}
    </div>
  );
}

export function CardTitle({
  className = "",
  children,
  ...props
}: HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3 className={`text-lg font-semibold text-white ${className}`} {...props}>
      {children}
    </h3>
  );
}
