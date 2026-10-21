type SpinnerProps = {
  className?: string;
};

export function Spinner({ className = "size-5" }: SpinnerProps) {
  return (
    <span
      role="status"
      aria-label="Loading"
      className={`inline-block animate-spin rounded-full border-2 border-current border-t-transparent motion-reduce:animate-none motion-reduce:opacity-60 ${className}`}
    />
  );
}
