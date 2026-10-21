import type { ReactNode } from "react";

type FormFieldProps = {
  id: string;
  label: string;
  error?: string;
  helperText?: string;
  children: ReactNode;
};

/**
 * Lays out a label, its control, and an error/helper message.
 *
 * Contract: this component does not clone or inspect `children`, so the
 * control you pass in (Input, PasswordInput, a custom control) must set its
 * own `id` to match the `id` prop here, and its own `aria-describedby` to
 * `${id}-error` whenever `error` is set — same convention this file uses to
 * generate the error paragraph's id. Kept explicit rather than magic so it
 * works with any control, not just a bare <input>.
 */
export function FormField({
  id,
  label,
  error,
  helperText,
  children,
}: FormFieldProps) {
  return (
    <div>
      <label htmlFor={id} className="mb-2 block text-sm font-medium text-ink">
        {label}
      </label>
      {children}
      {error ? (
        <p
          id={`${id}-error`}
          role="alert"
          className="mt-1.5 text-[13px] leading-5 text-error"
        >
          {error}
        </p>
      ) : helperText ? (
        <p className="mt-1.5 text-[13px] leading-5 text-ink-muted">
          {helperText}
        </p>
      ) : null}
    </div>
  );
}
