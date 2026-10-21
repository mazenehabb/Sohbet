import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { toast } from "@heroui/react";
import {
  HiMagnifyingGlass,
  HiBell,
  HiOutlineHome,
  HiOutlineGlobeAlt,
  HiOutlineChatBubbleLeftRight,
  HiArrowRightOnRectangle,
  HiUser,
} from "react-icons/hi2";
import type { PostUser } from "../../types/post.type";

export default function NavBar() {
  const location = useLocation();
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState<PostUser | null>(() => {
    try {
      const stored = localStorage.getItem("user");
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [hasNotification, setHasNotification] = useState(true);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setCurrentUser(null);
    setIsUserMenuOpen(false);
    toast.success("Signed out successfully");
    navigate("/login", { replace: true });
  };

  const isActive = (path: string) =>
    location.pathname === path || (path === "/" && location.pathname === "/home");

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-surface/95 backdrop-blur-md">
      <div className="mx-auto flex min-h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        {/* Brand Logo */}
        <Link to="/" className="flex shrink-0 items-center gap-2.5 group">
          <div className="flex size-10 items-center justify-center rounded-xl bg-primary text-xl font-black text-white shadow-button transition group-hover:bg-primary-strong">
            S
          </div>
          <span className="text-2xl font-black tracking-tight text-ink font-display">
            Sohbet
          </span>
        </Link>

        {/* Global Search Bar */}
        <div className="hidden w-full max-w-md items-center gap-3 rounded-field border border-line bg-canvas px-3.5 py-2 transition focus-within:border-primary focus-within:bg-surface focus-within:ring-2 focus-within:ring-accent/15 md:flex">
          <HiMagnifyingGlass className="size-4.5 shrink-0 text-ink-subtle" />
          <input
            type="search"
            placeholder="Search discussions, topics, people..."
            aria-label="Search Sohbet"
            className="w-full bg-transparent text-xs text-ink outline-none placeholder:text-ink-subtle"
          />
          <kbd className="hidden shrink-0 rounded border border-line bg-surface px-1.5 py-0.5 text-[10px] font-semibold text-ink-subtle sm:inline-block">
            ⌘ K
          </kbd>
        </div>

        {/* Main Desktop Navigation */}
        <nav aria-label="Main navigation" className="hidden items-center gap-1 lg:flex">
          <Link
            to="/"
            className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-semibold transition ${
              isActive("/")
                ? "bg-primary/10 text-primary"
                : "text-ink-muted hover:bg-canvas hover:text-ink"
            }`}
          >
            <HiOutlineHome className="size-4.5" />
            <span>Feed</span>
          </Link>

          <Link
            to="/"
            className="flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-semibold text-ink-muted transition hover:bg-canvas hover:text-ink"
          >
            <HiOutlineGlobeAlt className="size-4.5" />
            <span>Explore</span>
          </Link>

          <Link
            to="/"
            className="flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-semibold text-ink-muted transition hover:bg-canvas hover:text-ink"
          >
            <HiOutlineChatBubbleLeftRight className="size-4.5" />
            <span>Messages</span>
          </Link>
        </nav>

        {/* User Status / Actions */}
        <div className="flex shrink-0 items-center gap-2.5 sm:gap-3">
          {/* Notifications Button */}
          <button
            type="button"
            aria-label="Notifications"
            onClick={() => setHasNotification(false)}
            className="relative flex size-9.5 items-center justify-center rounded-xl border border-line bg-surface text-ink-muted transition hover:bg-canvas hover:text-ink focus:outline-none"
          >
            <HiBell className="size-4.5" />
            {hasNotification && (
              <span className="absolute right-2 top-2 size-2 rounded-full bg-accent ring-2 ring-surface animate-pulse" />
            )}
          </button>

          <div className="hidden h-6 w-px bg-line sm:block" />

          {/* User profile dropdown or Auth CTA */}
          {currentUser ? (
            <div className="relative">
              <button
                type="button"
                onClick={() => setIsUserMenuOpen((prev) => !prev)}
                className="flex items-center gap-2 rounded-xl p-1 transition hover:bg-canvas focus:outline-none"
              >
                <img
                  src={
                    currentUser.photo ||
                    "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80"
                  }
                  alt={currentUser.name}
                  className="size-8.5 rounded-full object-cover ring-2 ring-line"
                />
                <span className="hidden text-xs font-bold text-ink sm:block max-w-24 truncate">
                  {currentUser.name}
                </span>
              </button>

              {isUserMenuOpen && (
                <>
                  <div
                    className="fixed inset-0 z-20"
                    onClick={() => setIsUserMenuOpen(false)}
                  />
                  <div className="absolute right-0 top-11 z-30 min-w-48 overflow-hidden rounded-xl border border-line bg-surface py-1.5 shadow-xl animate-in fade-in zoom-in-95">
                    <div className="border-b border-line/60 px-3.5 py-2">
                      <p className="text-xs font-bold text-ink">{currentUser.name}</p>
                      <p className="truncate text-[11px] text-ink-subtle">
                        @{currentUser.username || "user"}
                      </p>
                    </div>

                    <Link
                      to="/"
                      onClick={() => setIsUserMenuOpen(false)}
                      className="flex items-center gap-2.5 px-3.5 py-2 text-xs font-medium text-ink transition hover:bg-canvas"
                    >
                      <HiUser className="size-4 text-ink-subtle" />
                      View Profile
                    </Link>

                    <button
                      type="button"
                      onClick={handleLogout}
                      className="flex w-full items-center gap-2.5 border-t border-line/60 px-3.5 py-2 text-xs font-medium text-error transition hover:bg-error-ring/30"
                    >
                      <HiArrowRightOnRectangle className="size-4" />
                      Sign out
                    </button>
                  </div>
                </>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                to="/login"
                className="rounded-field px-3 py-1.5 text-xs font-semibold text-ink transition hover:text-primary"
              >
                Sign in
              </Link>
              <Link
                to="/signup"
                className="rounded-field bg-primary px-3.5 py-1.5 text-xs font-semibold text-white shadow-button transition hover:bg-primary-strong"
              >
                Sign up
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Bottom Navigation Bar */}
      <nav
        aria-label="Mobile navigation"
        className="flex items-center justify-around border-t border-line bg-surface px-2 py-1.5 lg:hidden"
      >
        <Link
          to="/"
          className={`flex flex-col items-center gap-0.5 px-4 py-1 text-[11px] font-semibold ${
            isActive("/") ? "text-primary" : "text-ink-muted"
          }`}
        >
          <HiOutlineHome className="size-5" />
          <span>Feed</span>
        </Link>

        <Link
          to="/"
          className="flex flex-col items-center gap-0.5 px-4 py-1 text-[11px] font-medium text-ink-muted"
        >
          <HiOutlineGlobeAlt className="size-5" />
          <span>Explore</span>
        </Link>

        <Link
          to="/"
          className="flex flex-col items-center gap-0.5 px-4 py-1 text-[11px] font-medium text-ink-muted"
        >
          <HiOutlineChatBubbleLeftRight className="size-5" />
          <span>Messages</span>
        </Link>
      </nav>
    </header>
  );
}
