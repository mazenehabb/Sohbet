import { Link } from "react-router-dom";
import { HiSparkles, HiArrowRight } from "react-icons/hi2";

export default function GuestBanner() {
  return (
    <div className="mb-6 overflow-hidden rounded-panel border border-accent/30 bg-gradient-to-r from-primary/5 via-accent/10 to-canvas p-4 sm:p-5 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-start gap-3.5">
          <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary text-white shadow-sm shadow-primary/20">
            <HiSparkles className="size-5" />
          </span>
          <div>
            <h3 className="text-sm font-bold tracking-tight text-ink sm:text-[15px]">
              Welcome to the public Sohbet feed
            </h3>
            <p className="mt-0.5 text-xs leading-relaxed text-ink-muted">
              You are exploring in reader mode. Sign in to write posts, share high-res photos, like thoughts, and reply.
            </p>
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-2.5">
          <Link
            to="/login"
            className="rounded-field border border-line bg-surface px-4 py-2 text-xs font-semibold text-ink transition hover:border-primary hover:text-primary shadow-sm"
          >
            Sign In
          </Link>
          <Link
            to="/signup"
            className="flex items-center gap-1.5 rounded-field bg-primary px-4 py-2 text-xs font-semibold text-white shadow-button transition hover:bg-primary-strong"
          >
            <span>Create Account</span>
            <HiArrowRight className="size-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
