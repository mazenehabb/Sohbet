import { useState } from "react";
import { Link } from "react-router-dom";
import { HiSparkles, HiUserPlus, HiCheck, HiMagnifyingGlass } from "react-icons/hi2";
import type { PostUser } from "../../../types/post.type";

interface SuggestedUser {
  id: string;
  name: string;
  username: string;
  photo: string;
  role: string;
}

const initialSuggested: SuggestedUser[] = [
  {
    id: "sugg_1",
    name: "Dr. Kenan Idris",
    username: "kenan_ai",
    photo: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80",
    role: "AI Ethics & Interface Researcher",
  },
  {
    id: "sugg_2",
    name: "Celine Haddad",
    username: "celine_art",
    photo: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
    role: "Visual Designer & Typographer",
  },
  {
    id: "sugg_3",
    name: "Youssef Nabil",
    username: "ynabil",
    photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80",
    role: "Frontend Architect",
  },
];

interface FeedSidebarRightProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  currentUser?: PostUser | null;
}

export default function FeedSidebarRight({
  searchQuery,
  onSearchChange,
  currentUser,
}: FeedSidebarRightProps) {
  const [followingMap, setFollowingMap] = useState<Record<string, boolean>>({});

  const toggleFollow = (id: string) => {
    setFollowingMap((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  return (
    <aside className="space-y-4">
      {/* Search Input for Feed */}
      <div className="relative">
        <HiMagnifyingGlass className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 size-4.5 text-ink-subtle" />
        <input
          type="search"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search discussions & authors..."
          className="w-full rounded-field border border-line bg-surface py-2.5 pl-10 pr-4 text-xs text-ink placeholder:text-ink-subtle shadow-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-accent/15"
        />
      </div>

      {/* Suggested Creators */}
      <div className="rounded-panel border border-line bg-surface p-4 shadow-sm">
        <div className="mb-3.5 flex items-center justify-between">
          <h3 className="text-xs font-bold uppercase tracking-wider text-ink-muted">
            Connect & Follow
          </h3>
          <span className="text-[11px] font-medium text-accent">Recommended</span>
        </div>

        <div className="space-y-3">
          {initialSuggested.map((user) => {
            const isFollowing = followingMap[user.id];
            return (
              <div key={user.id} className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2.5 min-w-0">
                  <img
                    src={user.photo}
                    alt={user.name}
                    className="size-9 shrink-0 rounded-full object-cover ring-1 ring-line"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-xs font-semibold text-ink hover:text-primary transition">
                      {user.name}
                    </p>
                    <p className="truncate text-[11px] text-ink-subtle">
                      {user.role}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => toggleFollow(user.id)}
                  className={`flex shrink-0 items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold transition ${
                    isFollowing
                      ? "border border-line bg-canvas text-ink-muted hover:border-error-border hover:text-error"
                      : "bg-primary text-white hover:bg-primary-strong shadow-sm"
                  }`}
                >
                  {isFollowing ? (
                    <>
                      <HiCheck className="size-3" />
                      <span>Following</span>
                    </>
                  ) : (
                    <>
                      <HiUserPlus className="size-3" />
                      <span>Follow</span>
                    </>
                  )}
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Sohbet Spotlight (Premium brand card) */}
      <div className="relative overflow-hidden rounded-panel bg-panel p-5 text-white shadow-xl">
        {/* Glow ambient background effect */}
        <div className="pointer-events-none absolute -right-8 -top-8 size-36 rounded-full bg-accent/25 blur-2xl" />
        <div className="pointer-events-none absolute -left-8 -bottom-8 size-32 rounded-full bg-primary/40 blur-2xl" />

        <div className="relative z-10">
          <div className="mb-2.5 flex items-center gap-2">
            <span className="flex size-7 items-center justify-center rounded-lg bg-white/10 text-accent-soft backdrop-blur-md">
              <HiSparkles className="size-4" />
            </span>
            <span className="text-xs font-bold uppercase tracking-wider text-accent-soft">
              Sohbet 2026
            </span>
          </div>

          <h4 className="text-sm font-semibold leading-snug">
            Thoughtful spaces for authentic dialogues.
          </h4>
          <p className="mt-1.5 text-xs leading-relaxed text-panel-muted">
            No algorithmic noise, no outrage hooks. Just meaningful conversations with passionate thinkers and creators.
          </p>

          {!currentUser && (
            <div className="mt-4 flex items-center gap-2">
              <Link
                to="/signup"
                className="rounded-field bg-white px-3.5 py-1.5 text-xs font-semibold text-panel transition hover:bg-white/90"
              >
                Join Sohbet
              </Link>
              <Link
                to="/login"
                className="rounded-field border border-white/20 px-3.5 py-1.5 text-xs font-semibold text-white transition hover:bg-white/10"
              >
                Sign in
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Mini Footer / Meta */}
      <div className="px-1 text-[11px] text-ink-subtle space-y-1.5">
        <div className="flex flex-wrap gap-x-3 gap-y-1">
          <a href="#" className="hover:underline">Privacy Policy</a>
          <a href="#" className="hover:underline">Community Guidelines</a>
          <a href="#" className="hover:underline">Terms of Service</a>
          <a href="#" className="hover:underline">API</a>
        </div>
        <p>© 2026 Sohbet Social Inc. Built with care.</p>
      </div>
    </aside>
  );
}
