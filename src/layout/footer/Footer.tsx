import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="mt-16 border-t border-line bg-surface">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {/* Brand */}
          <div>
            <Link to="/" className="inline-flex items-center gap-2.5">
              <span className="flex size-10 items-center justify-center rounded-xl bg-primary text-xl font-extrabold text-white shadow-button">
                S
              </span>

              <span className="text-2xl font-black tracking-tight text-ink font-display">
                Sohbet
              </span>
            </Link>

            <p className="mt-4 max-w-xs text-sm leading-relaxed text-ink-muted">
              Connect with people, share authentic moments, and be part of genuine conversations.
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h2 className="text-xs font-bold uppercase tracking-wider text-ink">Explore</h2>

            <ul className="mt-4 space-y-2.5">
              <li>
                <Link
                  to="/"
                  className="text-xs text-ink-muted transition hover:text-primary"
                >
                  Home Stream
                </Link>
              </li>

              <li>
                <Link
                  to="/home"
                  className="text-xs text-ink-muted transition hover:text-primary"
                >
                  Community Feed
                </Link>
              </li>
            </ul>
          </div>

          {/* Account */}
          <div>
            <h2 className="text-xs font-bold uppercase tracking-wider text-ink">Account & Access</h2>

            <ul className="mt-4 space-y-2.5">
              <li>
                <Link
                  to="/login"
                  className="text-xs text-ink-muted transition hover:text-primary"
                >
                  Sign in
                </Link>
              </li>

              <li>
                <Link
                  to="/signup"
                  className="text-xs text-ink-muted transition hover:text-primary"
                >
                  Create account
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-10 flex flex-col gap-3 border-t border-line/60 pt-6 text-center sm:flex-row sm:items-center sm:justify-between sm:text-left">
          <p className="text-xs text-ink-subtle">
            © {new Date().getFullYear()} Sohbet Social. All rights reserved.
          </p>

          <p className="text-xs text-ink-subtle">
            A calmer corner of the internet.
          </p>
        </div>
      </div>
    </footer>
  );
}
