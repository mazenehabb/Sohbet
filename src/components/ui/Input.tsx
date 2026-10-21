import { forwardRef } from "react";
import type { InputHTMLAttributes } from "react";

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  /** Drives aria-invalid and the error border/ring. Pass !!errors.field. */
  invalid?: boolean;
};

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ invalid = false, className = "", ...props }, ref) => (
    <input
      ref={ref}
      aria-invalid={invalid ? "true" : "false"}
      className={`w-full rounded-field border border-line bg-surface px-4 py-3 text-[15px] text-ink outline-none transition placeholder:text-ink-subtle focus:border-primary focus:ring-4 focus:ring-accent/10 aria-[invalid=true]:border-error-border aria-[invalid=true]:ring-error-ring ${className}`}
      {...props}
    />
  ),
);
Input.displayName = "Input";
