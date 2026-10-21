import { useState, useEffect, useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "@heroui/react";
import {
  HiArrowPath,
  HiSparkles,
  HiClock,
  HiFire,
  HiAdjustmentsHorizontal,
  HiXMark,
} from "react-icons/hi2";
import type { Post, PostUser, PostsApiResponse } from "../../types/post.type";
import { initialMockPosts } from "../../data/mockPosts";
import StoriesRail from "./components/StoriesRail";
import CreatePostComposer from "./components/CreatePostComposer";
import PostCard from "./components/PostCard";
import FeedSidebarLeft from "./components/FeedSidebarLeft";
import FeedSidebarRight from "./components/FeedSidebarRight";
import PostLightboxModal from "./components/PostLightboxModal";
import FeedSkeleton from "./components/FeedSkeleton";
import GuestBanner from "./components/GuestBanner";

type FeedSort = "for-you" | "latest" | "popular";
type FeedFilter = "all" | "trending" | "media" | "saved";

export default function Home() {
  const navigate = useNavigate();
  const [posts, setPosts] = useState<Post[]>(initialMockPosts);
  const [isLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [currentUser, setCurrentUser] = useState<PostUser | null>(() => {
    try { 
      const storedUser = localStorage.getItem("user");
      return storedUser ? JSON.parse(storedUser) : null;
    } catch {
      return null;
    }
  });
  const [token, setToken] = useState<string | null>(() => {
    return localStorage.getItem("token");
  });

  // Filters & Search
  const [sortTab, setSortTab] = useState<FeedSort>("for-you");
  const [activeFilter, setActiveFilter] = useState<FeedFilter>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  // Lightbox
  const [lightbox, setLightbox] = useState<{
    isOpen: boolean;
    imageUrl: string;
    authorName?: string;
  }>({
    isOpen: false,
    imageUrl: "",
  });

  // Initial load of remote posts if token is present
  useEffect(() => {
    let ignore = false;
    const currentToken = localStorage.getItem("token");
    if (!currentToken) return;

    axios
      .get<PostsApiResponse>("https://route-posts.routemisr.com/posts?limit=50", {
        headers: { token: currentToken },
      })
      .then((res) => {
        if (!ignore && res.data?.data?.posts && Array.isArray(res.data.data.posts)) {
          if (res.data.data.posts.length > 0) {
            setPosts(res.data.data.posts);
          }
        }
      })
      .catch((err) => {
        console.warn("Could not fetch remote posts, showing curated stream:", err);
      });

    return () => {
      ignore = true;
    };
  }, []);

  // User-triggered manual refresh
  const handleRefresh = useCallback(async () => {
    const currentToken = localStorage.getItem("token") || token;
    if (!currentToken) {
      toast.success("Feed updated");
      return;
    }

    try {
      setIsRefreshing(true);
      const { data } = await axios.get<PostsApiResponse>(
        "https://route-posts.routemisr.com/posts?limit=50",
        {
          headers: { token: currentToken },
        }
      );

      if (data?.data?.posts && Array.isArray(data.data.posts) && data.data.posts.length > 0) {
        setPosts(data.data.posts);
      }
      toast.success("Feed refreshed");
    } catch (error) {
      console.warn("Refresh error:", error);
      toast.danger("Could not refresh feed", {
        description: "Please check your network and try again.",
      });
    } finally {
      setIsRefreshing(false);
    }
  }, [token]);

  // Handle Logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setToken(null);
    setCurrentUser(null);
    toast.success("Signed out successfully");
    navigate("/login", { replace: true });
  };

  // Add new post created in composer
  const handlePostCreated = (newPost: Post) => {
    setPosts((prev) => [newPost, ...prev]);
  };

  // Delete post
  const handleDeletePost = (postId: string) => {
    setPosts((prev) => prev.filter((p) => p._id !== postId));
  };

  // Filtered and Sorted Posts Computation
  const filteredPosts = useMemo(() => {
    let result = [...posts];

    // Search query filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (p) =>
          p.body?.toLowerCase().includes(q) ||
          p.user?.name?.toLowerCase().includes(q) ||
          p.user?.username?.toLowerCase().includes(q)
      );
    }

    // Hashtag filter
    if (selectedTag) {
      const tagLower = selectedTag.toLowerCase();
      result = result.filter((p) =>
        p.body?.toLowerCase().includes(tagLower)
      );
    }

    // Category / Navigation filter
    if (activeFilter === "trending") {
      result = result.filter(
        (p) => (p.likesCount || p.likes?.length || 0) > 5 || (p.commentsCount || 0) > 3
      );
    } else if (activeFilter === "media") {
      result = result.filter((p) => Boolean(p.image));
    } else if (activeFilter === "saved") {
      result = result.filter((p) => Boolean(p.bookmarked));
    }

    // Sorting
    if (sortTab === "latest") {
      result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    } else if (sortTab === "popular") {
      result.sort(
        (a, b) =>
          (b.likesCount || b.likes?.length || 0) - (a.likesCount || a.likes?.length || 0)
      );
    }

    return result;
  }, [posts, searchQuery, selectedTag, activeFilter, sortTab]);

  return (
    <main className="min-h-screen bg-canvas py-6">
      <div className="mx-auto max-w-7xl px-3 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          {/* Left Sidebar (Desktop) */}
          <div className="hidden lg:col-span-3 lg:block">
            <div className="sticky top-20">
              <FeedSidebarLeft
                currentUser={currentUser}
                activeFilter={activeFilter}
                onFilterChange={setActiveFilter}
                selectedTag={selectedTag}
                onSelectTag={setSelectedTag}
                onLogout={handleLogout}
              />
            </div>
          </div>

          {/* Center Main Feed Column */}
          <div className="lg:col-span-6">
            {/* Show Guest Banner if not signed in */}
            {!token && <GuestBanner />}

            {/* Stories / Moments Reel */}
            <StoriesRail currentUser={currentUser} />

            {/* Create Post Composer */}
            <CreatePostComposer
              currentUser={currentUser}
              onPostCreated={handlePostCreated}
            />

            {/* Feed Control Bar: Sort Tabs & Refresh */}
            <div className="mb-5 flex flex-wrap items-center justify-between gap-3 rounded-panel border border-line bg-surface p-2 shadow-sm sm:px-4 sm:py-2.5">
              {/* Segmented Sort Tabs */}
              <div className="flex items-center gap-1 rounded-xl bg-canvas p-1">
                <button
                  type="button"
                  onClick={() => setSortTab("for-you")}
                  className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
                    sortTab === "for-you"
                      ? "bg-surface text-ink shadow-sm"
                      : "text-ink-muted hover:text-ink"
                  }`}
                >
                  <HiSparkles className="size-3.5 text-accent" />
                  <span>For You</span>
                </button>

                <button
                  type="button"
                  onClick={() => setSortTab("latest")}
                  className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
                    sortTab === "latest"
                      ? "bg-surface text-ink shadow-sm"
                      : "text-ink-muted hover:text-ink"
                  }`}
                >
                  <HiClock className="size-3.5 text-primary" />
                  <span>Latest</span>
                </button>

                <button
                  type="button"
                  onClick={() => setSortTab("popular")}
                  className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
                    sortTab === "popular"
                      ? "bg-surface text-ink shadow-sm"
                      : "text-ink-muted hover:text-ink"
                  }`}
                >
                  <HiFire className="size-3.5 text-amber-500" />
                  <span>Top</span>
                </button>
              </div>

              {/* Mobile Filter / Active Filter Badges */}
              <div className="flex items-center gap-2">
                {selectedTag && (
                  <span className="flex items-center gap-1 rounded-full bg-accent/10 px-2.5 py-1 text-xs font-medium text-accent">
                    <span>{selectedTag}</span>
                    <button
                      type="button"
                      onClick={() => setSelectedTag(null)}
                      className="hover:text-ink"
                    >
                      <HiXMark className="size-3" />
                    </button>
                  </span>
                )}

                {activeFilter !== "all" && (
                  <span className="rounded-full bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary capitalize">
                    {activeFilter}
                  </span>
                )}

                {/* Refresh Feed Button */}
                <button
                  type="button"
                  onClick={() => handleRefresh()}
                  disabled={isRefreshing}
                  className="flex items-center gap-1.5 rounded-xl border border-line bg-surface px-3 py-1.5 text-xs font-medium text-ink-muted transition hover:bg-canvas hover:text-ink disabled:opacity-50"
                  title="Refresh feed"
                >
                  <HiArrowPath
                    className={`size-3.5 ${isRefreshing ? "animate-spin text-primary" : ""}`}
                  />
                  <span className="hidden sm:inline">Refresh</span>
                </button>
              </div>
            </div>

            {/* Mobile Filter Chips (visible on mobile only) */}
            <div className="mb-4 flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none lg:hidden">
              {(["all", "trending", "media", "saved"] as FeedFilter[]).map((filter) => (
                <button
                  key={filter}
                  type="button"
                  onClick={() => setActiveFilter(filter)}
                  className={`shrink-0 rounded-full px-3.5 py-1.5 text-xs font-semibold capitalize transition ${
                    activeFilter === filter
                      ? "bg-primary text-white shadow-button"
                      : "border border-line bg-surface text-ink-muted"
                  }`}
                >
                  {filter}
                </button>
              ))}
            </div>

            {/* Post Feed List */}
            {isLoading ? (
              <FeedSkeleton />
            ) : filteredPosts.length === 0 ? (
              <div className="rounded-panel border border-line bg-surface py-16 px-4 text-center shadow-sm">
                <div className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-primary/10 text-primary mb-3">
                  <HiAdjustmentsHorizontal className="size-7" />
                </div>
                <h3 className="text-base font-bold text-ink">No conversations found</h3>
                <p className="mt-1 text-xs text-ink-subtle max-w-sm mx-auto">
                  {searchQuery || selectedTag
                    ? `No posts matched "${searchQuery || selectedTag}". Try adjusting your filters.`
                    : "No posts match the selected filter. Try switching back to 'Discover All'."}
                </p>
                <div className="mt-4 flex items-center justify-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setSearchQuery("");
                      setSelectedTag(null);
                      setActiveFilter("all");
                    }}
                    className="rounded-field bg-primary px-4 py-2 text-xs font-semibold text-white shadow-button hover:bg-primary-strong"
                  >
                    Reset all filters
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredPosts.map((post) => (
                  <PostCard
                    key={post._id}
                    post={post}
                    currentUser={currentUser}
                    onDeletePost={handleDeletePost}
                    onTagClick={(tag) => setSelectedTag(tag)}
                    onOpenLightbox={(imageUrl, authorName) =>
                      setLightbox({ isOpen: true, imageUrl, authorName })
                    }
                  />
                ))}
              </div>
            )}
          </div>

          {/* Right Sidebar (Desktop) */}
          <div className="hidden lg:col-span-3 lg:block">
            <div className="sticky top-20">
              <FeedSidebarRight
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
                currentUser={currentUser}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Lightbox Modal */}
      {lightbox.isOpen && (
        <PostLightboxModal
          imageUrl={lightbox.imageUrl}
          authorName={lightbox.authorName}
          onClose={() => setLightbox({ isOpen: false, imageUrl: "" })}
        />
      )}
    </main>
  );
}
