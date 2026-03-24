import type { ReactNode } from "react";

interface ButtonProps {
  children: ReactNode;
  icon?: ReactNode;
  onClick?: () => void;
  type?: "button" | "submit";
  variant?: "primary" | "secondary" | "danger" | "success";
}

export default function Button({
  children,
  icon,
  onClick,
  type = "button",
  variant = "primary",
}: ButtonProps) {
  return (
    <button type={type} onClick={onClick} className={`button ${variant}`}>
      {icon}
      <span>{children}</span>
    </button>
  );
}
