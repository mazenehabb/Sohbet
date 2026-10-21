import { forwardRef } from "react";
import type { ButtonHTMLAttributes } from "react";
import { Spinner } from "./Spinner";

type ButtonVariant = "primary" | "secondary" | "outline" | "ghost";
type ButtonSize = "md" | "sm";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
  /** Shows a spinner and disables the button. Not wired to any page yet —
   *  intended for when a real async submit handler lands. */
  isLoading?: boolean;
};

const variantClasses: Record<ButtonVariant, string> = {
  primary: "bg-primary text-white shadow-button hover:bg-primary-strong",
  secondary: "bg-panel text-white hover:bg-panel/90",
  outline:
    "border border-line bg-surface text-ink hover:border-primary hover:text-primary",
  ghost: "text-ink hover:bg-ink/5",
};

const sizeClasses: Record<ButtonSize, string> = {
  md: "px-4 py-3.5 text-[15px]",
  sm: "px-3.5 py-2.5 text-sm",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = "primary",
      size = "md",
      isLoading = false,
      disabled,
      className = "",
      children,
      ...props
    },
    ref,
  ) => (
    <button
      ref={ref}
      disabled={disabled || isLoading}
      aria-busy={isLoading || undefined}
      className={`inline-flex items-center justify-center gap-2 rounded-field font-medium transition focus:outline-none focus-visible:ring-4 focus-visible:ring-accent/30 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60 ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
      {...props}
    >
      {isLoading && <Spinner className="size-4" />}
      {children}
    </button>
  ),
);
Button.displayName = "Button";
