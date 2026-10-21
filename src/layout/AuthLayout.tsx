import type { ReactNode } from "react";
import { Link } from "react-router-dom";

type AuthLayoutProps = {
  /** The brand-panel statement, e.g. a few stacked <span className="block"> lines. */
  headline: ReactNode;
  subcopy?: string;
  /** Page-specific content for the form side: heading, form, footer links. */
  children: ReactNode;
};

/**
 * Split-screen chrome shared by every auth page: a dark brand panel
 * (desktop/lg+ only) and a form panel. On mobile the brand panel collapses
 * to a slim logo band so the form stays the priority.
 */
export function AuthLayout({ headline, subcopy, children }: AuthLayoutProps) {
  return (
    <main className="relative isolate grid min-h-dvh grid-cols-1 overflow-x-hidden bg-canvas lg:grid-cols-[minmax(0,0.96fr)_minmax(0,1.04fr)]">
      {/* single, restrained entrance moment for the brand-panel motifs;
          kept local rather than touching global CSS */}
      <style>{`
        @keyframes sohbet-rise {
          from { opacity: 0; transform: translateY(14px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .sohbet-rise { animation: sohbet-rise .8s cubic-bezier(.16,1,.3,1) both; }
        @media (prefers-reduced-motion: reduce) {
          .sohbet-rise { animation: none; }
        }
      `}</style>

      {/* Brand panel — intentionally reserved for larger viewports so the
          form remains the focus on smaller screens. */}
      <aside
        aria-label="About Sohbet"
        className="relative hidden min-h-0 flex-col overflow-hidden bg-panel px-10 py-10 lg:flex lg:h-dvh xl:px-14 xl:py-12"
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -left-32 -top-32 h-[34rem] w-[34rem] rounded-full bg-[radial-gradient(closest-side,var(--color-accent),transparent)] opacity-25 blur-3xl"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-40 -right-24 h-[32rem] w-[32rem] rounded-full bg-[radial-gradient(closest-side,var(--color-primary),transparent)] opacity-50 blur-3xl"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[linear-gradient(135deg,transparent_0%,rgb(255_255_255_/_0.035)_50%,transparent_100%)]"
        />

        <header className="relative z-10 flex items-center justify-between">
          <Link
            to="/login"
            className="group flex items-center gap-2.5 rounded-field focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-soft focus-visible:ring-offset-2 focus-visible:ring-offset-panel"
          >
            <span className="flex size-10 items-center justify-center rounded-field bg-white text-lg font-semibold text-panel shadow-[0_8px_20px_rgb(0_0_0_/_0.12)] transition-transform duration-300 group-hover:-rotate-6 group-hover:scale-105">
              S
            </span>
            <span className="text-xl font-semibold tracking-tight text-white">
              Sohbet
            </span>
          </Link>
          <span className="rounded-full border border-white/10 bg-white/[0.06] px-3 py-1.5 text-[11px] font-medium uppercase tracking-[0.14em] text-panel-muted">
            Find your circle
          </span>
        </header>

        <div className="relative z-10 my-auto max-w-xl py-14 xl:py-16">
          <p className="mb-5 flex items-center gap-2 text-xs font-medium uppercase tracking-[0.18em] text-accent-soft">
            <span className="h-px w-7 bg-accent-soft/70" />
            Conversations, considered
          </p>
          <div className="font-display text-[2.9rem] leading-[1.04] tracking-[-0.025em] text-white xl:text-[3.7rem]">
            {headline}
          </div>
          {subcopy && (
            <p className="mt-6 max-w-md text-[15px] leading-6 text-panel-muted xl:text-base">
              {subcopy}
            </p>
          )}
        </div>

        {/* decorative, illustrative conversation motifs — not live data */}
        <div aria-hidden="true" className="relative z-10 hidden h-44 xl:block">
          <div className="sohbet-rise absolute bottom-12 left-0 w-60 rounded-panel border border-white/10 bg-white/[0.07] px-4 py-3.5 shadow-[0_18px_50px_rgb(0_0_0_/_0.16)] backdrop-blur-sm [animation-delay:0ms]">
            <div className="flex items-center gap-2">
              <span className="flex size-7 items-center justify-center rounded-full bg-accent-soft text-[10px] font-semibold text-panel">
                M
              </span>
              <span className="text-[13px] font-medium text-white">Maya</span>
              <span className="ml-auto size-1.5 rounded-full bg-accent-soft" />
            </div>
            <p className="mt-2 truncate text-[13px] text-panel-muted">
              can't wait for tonight, see you there
            </p>
          </div>

          <div className="sohbet-rise absolute bottom-0 left-20 w-56 rounded-panel border border-white/10 bg-white/[0.07] px-4 py-3.5 shadow-[0_18px_50px_rgb(0_0_0_/_0.16)] backdrop-blur-sm [animation-delay:120ms]">
            <div className="flex items-center gap-2">
              <span className="flex size-7 items-center justify-center rounded-full bg-accent text-[10px] font-semibold text-white">
                T
              </span>
              <span className="text-[13px] font-medium text-white">Theo</span>
            </div>
            <p className="mt-2 truncate text-[13px] text-panel-muted">
              just posted in #photography
            </p>
          </div>

          <div className="sohbet-rise absolute bottom-0 right-0 flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.07] py-2 pl-2 pr-4 backdrop-blur-sm [animation-delay:240ms]">
            <span className="flex -space-x-2">
              <span className="size-6 rounded-full border-2 border-panel bg-accent-soft" />
              <span className="size-6 rounded-full border-2 border-panel bg-accent" />
              <span className="size-6 rounded-full border-2 border-panel bg-primary" />
            </span>
            <span className="text-[13px] text-panel-muted">typing…</span>
          </div>
        </div>
      </aside>

      {/* form panel */}
      <section className="relative flex min-h-dvh items-center justify-center overflow-x-hidden px-5 py-8 sm:px-8 sm:py-10 lg:px-10 lg:py-0 xl:px-16">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute right-0 top-0 hidden h-72 w-72 translate-x-1/3 -translate-y-1/3 rounded-full bg-accent/10 blur-3xl lg:block"
        />
        <div className="relative w-full max-w-[440px]">
          {/* compact brand band — mobile / tablet-portrait only */}
          <Link
            to="/login"
            className="group mb-9 flex w-fit items-center gap-2.5 rounded-field focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 lg:hidden"
          >
            <span className="flex size-9 items-center justify-center rounded-field bg-panel text-base font-semibold text-white shadow-button transition-transform duration-300 group-hover:-rotate-6 group-hover:scale-105">
              S
            </span>
            <span className="text-lg font-semibold tracking-tight text-ink">
              Sohbet
            </span>
          </Link>

          <div className="rounded-panel border border-line/80 bg-surface p-5 shadow-card sm:p-8 lg:p-9">
            {children}
          </div>
        </div>
      </section>
    </main>
  );
}
