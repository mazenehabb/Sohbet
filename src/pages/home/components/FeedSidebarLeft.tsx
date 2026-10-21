import { Link } from "react-router-dom";
import {
  HiGlobeAlt,
  HiFire,
  HiPhoto,
  HiBookmark,
  HiOutlineHashtag,
  HiOutlineArrowRightOnRectangle,
} from "react-icons/hi2";
import type { PostUser } from "../../../types/post.type";

interface FeedSidebarLeftProps {
  currentUser?: PostUser | null;
  activeFilter: "all" | "trending" | "media" | "saved";
  onFilterChange: (filter: "all" | "trending" | "media" | "saved") => void;
  selectedTag?: string | null;
  onSelectTag?: (tag: string | null) => void;
  onLogout?: () => void;
}

export default function FeedSidebarLeft({
  currentUser,
  activeFilter,
  onFilterChange,
  selectedTag,
  onSelectTag,
  onLogout,
}: FeedSidebarLeftProps) {
  const topics = [
    { name: "#Design2026", count: "1.4k posts" },
    { name: "#React19", count: "890 posts" },
    { name: "#CreativeTech", count: "720 posts" },
    { name: "#TailwindCSS", count: "510 posts" },
    { name: "#SohbetMoments", count: "340 posts" },
  ];

  return (
    <aside className="space-y-4">
      {/* User Profile Card */}
      <div className="overflow-hidden rounded-panel border border-line bg-surface shadow-sm">
        {/* Banner with subtle brand gradient */}
        <div className="h-16 w-full bg-gradient-to-r from-panel via-primary to-accent" />

        <div className="relative px-4 pb-4 pt-0">
          <div className="flex items-end justify-between">
            <img
              src={
                currentUser?.photo ||
                "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80"
              }
              alt={currentUser?.name || "User avatar"}
              className="-mt-8 size-16 rounded-full border-3 border-surface object-cover shadow-sm ring-1 ring-line"
            />
            {currentUser ? (
              <span className="mb-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] font-semibold text-emerald-700">
                Online
              </span>
            ) : (
              <Link
                to="/login"
                className="mb-1 rounded-field bg-primary/10 px-2.5 py-1 text-xs font-semibold text-primary transition hover:bg-primary/20"
              >
                Sign In
              </Link>
            )}
          </div>

          <div className="mt-2.5">
            <h2 className="text-base font-bold tracking-tight text-ink">
              {currentUser?.name || "Guest Reader"}
            </h2>
            <p className="text-xs text-ink-subtle">
              {currentUser?.username ? `@${currentUser.username}` : "Welcome to the Sohbet feed"}
            </p>
          </div>

          {/* Quick stats */}
          <div className="mt-3.5 grid grid-cols-3 divide-x divide-line/60 rounded-xl border border-line/60 bg-canvas/70 py-2 text-center text-xs">
            <div>
              <p className="font-bold text-ink">{currentUser ? "18" : "0"}</p>
              <p className="text-[10px] text-ink-subtle">Posts</p>
            </div>
            <div>
              <p className="font-bold text-ink">{currentUser ? "254" : "1.2k"}</p>
              <p className="text-[10px] text-ink-subtle">Followers</p>
            </div>
            <div>
              <p className="font-bold text-ink">{currentUser ? "120" : "48"}</p>
              <p className="text-[10px] text-ink-subtle">Following</p>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Filter List */}
      <nav aria-label="Feed filters" className="rounded-panel border border-line bg-surface p-2 shadow-sm">
        <div className="space-y-1">
          <button
            type="button"
            onClick={() => {
              onFilterChange("all");
              onSelectTag?.(null);
            }}
            className={`flex w-full items-center gap-3 rounded-xl px-3.5 py-2.5 text-xs font-semibold transition ${
              activeFilter === "all" && !selectedTag
                ? "bg-primary text-white shadow-button"
                : "text-ink-muted hover:bg-canvas hover:text-ink"
            }`}
          >
            <HiGlobeAlt className="size-4.5" />
            <span>Discover All</span>
          </button>

          <button
            type="button"
            onClick={() => {
              onFilterChange("trending");
              onSelectTag?.(null);
            }}
            className={`flex w-full items-center gap-3 rounded-xl px-3.5 py-2.5 text-xs font-semibold transition ${
              activeFilter === "trending" && !selectedTag
                ? "bg-primary text-white shadow-button"
                : "text-ink-muted hover:bg-canvas hover:text-ink"
            }`}
          >
            <HiFire className="size-4.5" />
            <span>Popular & Trending</span>
          </button>

          <button
            type="button"
            onClick={() => {
              onFilterChange("media");
              onSelectTag?.(null);
            }}
            className={`flex w-full items-center gap-3 rounded-xl px-3.5 py-2.5 text-xs font-semibold transition ${
              activeFilter === "media" && !selectedTag
                ? "bg-primary text-white shadow-button"
                : "text-ink-muted hover:bg-canvas hover:text-ink"
            }`}
          >
            <HiPhoto className="size-4.5" />
            <span>Visual & Media</span>
          </button>

          <button
            type="button"
            onClick={() => {
              onFilterChange("saved");
              onSelectTag?.(null);
            }}
            className={`flex w-full items-center gap-3 rounded-xl px-3.5 py-2.5 text-xs font-semibold transition ${
              activeFilter === "saved" && !selectedTag
                ? "bg-primary text-white shadow-button"
                : "text-ink-muted hover:bg-canvas hover:text-ink"
            }`}
          >
            <HiBookmark className="size-4.5" />
            <span>Saved Moments</span>
          </button>
        </div>

        {currentUser && onLogout && (
          <div className="mt-2 border-t border-line/60 pt-2">
            <button
              type="button"
              onClick={onLogout}
              className="flex w-full items-center gap-3 rounded-xl px-3.5 py-2 text-xs font-medium text-ink-subtle transition hover:bg-error-ring/30 hover:text-error"
            >
              <HiOutlineArrowRightOnRectangle className="size-4" />
              <span>Sign out</span>
            </button>
          </div>
        )}
      </nav>

      {/* Trending Topics / Hashtags */}
      <div className="rounded-panel border border-line bg-surface p-4 shadow-sm">
        <div className="mb-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <HiOutlineHashtag className="size-4 text-accent" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-ink-muted">
              Curated Topics
            </h3>
          </div>
          {selectedTag && (
            <button
              type="button"
              onClick={() => onSelectTag?.(null)}
              className="text-[11px] font-semibold text-accent hover:underline"
            >
              Clear
            </button>
          )}
        </div>

        <div className="space-y-1.5">
          {topics.map((t) => {
            const isSelected = selectedTag === t.name;
            return (
              <button
                key={t.name}
                type="button"
                onClick={() => onSelectTag?.(isSelected ? null : t.name)}
                className={`flex w-full items-center justify-between rounded-xl px-3 py-2 text-left transition ${
                  isSelected
                    ? "bg-accent/15 text-accent font-semibold"
                    : "hover:bg-canvas text-ink-muted hover:text-ink"
                }`}
              >
                <span className="text-xs font-medium">{t.name}</span>
                <span className="text-[10px] text-ink-subtle">{t.count}</span>
              </button>
            );
          })}
        </div>
      </div>
    </aside>
  );
}
