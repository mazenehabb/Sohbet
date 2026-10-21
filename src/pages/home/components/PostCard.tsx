import { useState, type ReactNode } from "react";
import axios from "axios";
import { toast } from "@heroui/react";
import {
  HiHeart,
  HiOutlineHeart,
  HiChatBubbleOvalLeftEllipsis,
  HiOutlineChatBubbleOvalLeftEllipsis,
  HiShare,
  HiBookmark,
  HiOutlineBookmark,
  HiEllipsisHorizontal,
  HiTrash,
  HiLink,
  HiOutlineGlobeAmericas,
  HiCheckBadge,
} from "react-icons/hi2";
import type { Post, PostUser } from "../../../types/post.type";
import { formatRelativeTime } from "../../../utils/date";
import PostComments from "./PostComments";

interface PostCardProps {
  post: Post;
  currentUser?: PostUser | null;
  onDeletePost?: (postId: string) => void;
  onOpenLightbox?: (imageUrl: string, authorName?: string) => void;
  onTagClick?: (tag: string) => void;
}

export default function PostCard({
  post,
  currentUser,
  onDeletePost,
  onOpenLightbox,
  onTagClick,
}: PostCardProps) {
  const currentUserId = currentUser?._id || "";
  const initialLiked =
    Boolean(post.likes?.includes(currentUserId)) ||
    Boolean(currentUserId && post.likes?.some((id) => id === currentUserId));

  const [isLiked, setIsLiked] = useState(initialLiked);
  const [likesCount, setLikesCount] = useState(post.likesCount ?? post.likes?.length ?? 0);
  const [isBookmarked, setIsBookmarked] = useState(Boolean(post.bookmarked));
  const [showComments, setShowComments] = useState(false);
  const [commentsCount, setCommentsCount] = useState(post.commentsCount ?? (post.topComment ? 1 : 0));
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isTextExpanded, setIsTextExpanded] = useState(false);

  const isAuthor =
    Boolean(currentUser && (currentUser._id === post.user?._id || currentUser.username === post.user?.username));

  // Like Toggle
  const handleLikeToggle = () => {
    const nextState = !isLiked;
    setIsLiked(nextState);
    setLikesCount((prev) => (nextState ? prev + 1 : Math.max(0, prev - 1)));
  };

  // Bookmark Toggle
  const handleBookmarkToggle = () => {
    const next = !isBookmarked;
    setIsBookmarked(next);
    toast.success(next ? "Post saved" : "Post removed from saved", {
      description: next ? "You can find this anytime in your Bookmarks." : undefined,
    });
  };

  // Copy Link
  const handleCopyLink = () => {
    const url = `${window.location.origin}/#post-${post._id}`;
    navigator.clipboard.writeText(url).then(() => {
      toast.success("Link copied to clipboard!");
      setIsMenuOpen(false);
    });
  };

  // Delete Post
  const handleDeletePost = async () => {
    if (!window.confirm("Are you sure you want to delete this post?")) return;

    const token = localStorage.getItem("token");
    setIsDeleting(true);
    setIsMenuOpen(false);

    try {
      if (token && !post._id.startsWith("mock_") && !post._id.startsWith("temp_") && !post._id.startsWith("guest_")) {
        await axios.delete(`https://route-posts.routemisr.com/posts/${post._id}`, {
          headers: { token },
        });
      }
      toast.success("Post deleted");
      onDeletePost?.(post._id);
    } catch (error) {
      console.error("Delete error:", error);
      toast.danger("Could not delete post", {
        description: "Please check your network and try again.",
      });
      setIsDeleting(false);
    }
  };

  // Text formatter to highlight #hashtags and @mentions
  const renderFormattedText = (text: string): ReactNode[] => {
    if (!text) return [];
    const tokens = text.split(/(\s+)/);

    return tokens.map((part, index) => {
      if (part.startsWith("#") && part.length > 1) {
        return (
          <button
            key={index}
            type="button"
            onClick={() => onTagClick?.(part)}
            className="inline-block font-semibold text-accent transition hover:text-primary hover:underline"
          >
            {part}
          </button>
        );
      }
      if (part.startsWith("@") && part.length > 1) {
        return (
          <span key={index} className="font-semibold text-primary">
            {part}
          </span>
        );
      }
      return part;
    });
  };

  const isLongText = (post.body || "").length > 260;
  const displayText =
    isLongText && !isTextExpanded
      ? `${post.body.slice(0, 260)}...`
      : post.body;

  return (
    <article
      id={`post-${post._id}`}
      className={`group relative mb-5 overflow-hidden rounded-panel border border-line bg-surface p-5 shadow-card transition-all duration-200 hover:border-accent-soft/40 ${
        isDeleting ? "opacity-50 pointer-events-none scale-95" : ""
      }`}
    >
      {/* Post Author Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="relative">
            <img
              src={
                post.user?.photo ||
                "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80"
              }
              alt={post.user?.name || "Author"}
              className="size-11 rounded-full object-cover ring-2 ring-line/80 transition group-hover:ring-accent/40"
              loading="lazy"
            />
          </div>

          <div>
            <div className="flex items-center gap-1.5">
              <h3 className="text-sm font-semibold tracking-tight text-ink hover:text-primary transition">
                {post.user?.name || "Community Member"}
              </h3>
              {(post.user?.username === "sohbet_official" || post.user?.username === "virgil") && (
                <HiCheckBadge className="size-4 text-accent" title="Verified Creator" />
              )}
            </div>

            <div className="flex items-center gap-2 text-xs text-ink-subtle">
              {post.user?.username && <span>@{post.user.username}</span>}
              <span>•</span>
              <time dateTime={post.createdAt}>{formatRelativeTime(post.createdAt)}</time>
              <span>•</span>
              <span className="flex items-center gap-0.5 text-[11px]" title="Public Post">
                <HiOutlineGlobeAmericas className="size-3" />
              </span>
            </div>
          </div>
        </div>

        {/* Post Options Menu */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setIsMenuOpen((prev) => !prev)}
            aria-label="Post actions"
            className="flex size-8 items-center justify-center rounded-lg text-ink-subtle transition hover:bg-canvas hover:text-ink focus:outline-none"
          >
            <HiEllipsisHorizontal className="size-5" />
          </button>

          {isMenuOpen && (
            <>
              <div
                className="fixed inset-0 z-20"
                onClick={() => setIsMenuOpen(false)}
              />
              <div className="absolute right-0 top-9 z-30 min-w-44 overflow-hidden rounded-xl border border-line bg-surface py-1.5 shadow-xl animate-in fade-in zoom-in-95">
                <button
                  type="button"
                  onClick={handleCopyLink}
                  className="flex w-full items-center gap-2 px-3.5 py-2 text-xs font-medium text-ink transition hover:bg-canvas"
                >
                  <HiLink className="size-4 text-ink-subtle" />
                  Copy post link
                </button>

                <button
                  type="button"
                  onClick={handleBookmarkToggle}
                  className="flex w-full items-center gap-2 px-3.5 py-2 text-xs font-medium text-ink transition hover:bg-canvas"
                >
                  <HiBookmark className="size-4 text-ink-subtle" />
                  {isBookmarked ? "Remove bookmark" : "Save post"}
                </button>

                {isAuthor && (
                  <button
                    type="button"
                    onClick={handleDeletePost}
                    className="flex w-full items-center gap-2 border-t border-line/60 px-3.5 py-2 text-xs font-medium text-error transition hover:bg-error-ring/30"
                  >
                    <HiTrash className="size-4" />
                    Delete post
                  </button>
                )}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Post Text Body */}
      {post.body && (
        <div className="mt-3.5 text-[15px] leading-relaxed text-ink/90 whitespace-pre-wrap">
          {renderFormattedText(displayText)}
          {isLongText && (
            <button
              type="button"
              onClick={() => setIsTextExpanded((prev) => !prev)}
              className="ml-1 text-xs font-semibold text-accent hover:underline"
            >
              {isTextExpanded ? "Show less" : "Read more"}
            </button>
          )}
        </div>
      )}

      {/* Post Media (Image) */}
      {post.image && (
        <div
          className="relative mt-3.5 overflow-hidden rounded-xl border border-line bg-canvas group/img cursor-pointer"
          onClick={() => onOpenLightbox?.(post.image!, post.user?.name)}
        >
          <img
            src={post.image}
            alt="Post media"
            loading="lazy"
            className="max-h-[500px] w-full object-cover transition-transform duration-500 group-hover/img:scale-[1.02]"
          />
          <div className="absolute inset-0 bg-ink/5 opacity-0 transition group-hover/img:opacity-100 flex items-center justify-center">
            <span className="rounded-full bg-panel/75 px-3 py-1.5 text-xs font-medium text-white shadow-md backdrop-blur-sm">
              Click to enlarge ⤢
            </span>
          </div>
        </div>
      )}

      {/* Embedded Shared Post if present */}
      {post.sharedPost && (
        <div className="mt-3.5 overflow-hidden rounded-xl border border-line bg-canvas/60 p-4">
          <div className="flex items-center gap-2.5">
            <img
              src={post.sharedPost.user?.photo || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80"}
              alt="Original author"
              className="size-7 rounded-full object-cover"
            />
            <div>
              <p className="text-xs font-semibold text-ink">{post.sharedPost.user?.name || "Shared post"}</p>
              <p className="text-[10px] text-ink-subtle">{formatRelativeTime(post.sharedPost.createdAt)}</p>
            </div>
          </div>
          {post.sharedPost.body && (
            <p className="mt-2 text-xs leading-relaxed text-ink/85">{post.sharedPost.body}</p>
          )}
          {post.sharedPost.image && (
            <img
              src={post.sharedPost.image}
              alt="Shared attachment"
              className="mt-2 max-h-56 w-full rounded-lg object-cover"
            />
          )}
        </div>
      )}

      {/* Engagement Bar / Metrics */}
      <div className="mt-4 flex items-center justify-between border-t border-line/60 pt-3">
        <div className="flex items-center gap-1 sm:gap-2">
          {/* Like button */}
          <button
            type="button"
            onClick={handleLikeToggle}
            className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition active:scale-90 ${
              isLiked
                ? "bg-rose-50 text-rose-600"
                : "text-ink-muted hover:bg-canvas hover:text-rose-600"
            }`}
            title="Like this post"
          >
            {isLiked ? (
              <HiHeart className="size-4.5 text-rose-600 animate-in zoom-in-75" />
            ) : (
              <HiOutlineHeart className="size-4.5" />
            )}
            <span>{likesCount}</span>
          </button>

          {/* Comment button */}
          <button
            type="button"
            onClick={() => setShowComments((prev) => !prev)}
            className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition ${
              showComments
                ? "bg-primary/10 text-primary"
                : "text-ink-muted hover:bg-canvas hover:text-primary"
            }`}
            title="View and add comments"
          >
            {showComments ? (
              <HiChatBubbleOvalLeftEllipsis className="size-4.5 text-primary" />
            ) : (
              <HiOutlineChatBubbleOvalLeftEllipsis className="size-4.5" />
            )}
            <span>{commentsCount}</span>
          </button>

          {/* Share button */}
          <button
            type="button"
            onClick={handleCopyLink}
            className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium text-ink-muted transition hover:bg-canvas hover:text-accent"
            title="Share post"
          >
            <HiShare className="size-4.5" />
            <span className="hidden sm:inline">Share</span>
          </button>
        </div>

        {/* Bookmark button */}
        <button
          type="button"
          onClick={handleBookmarkToggle}
          className={`flex size-8 items-center justify-center rounded-lg transition ${
            isBookmarked
              ? "text-primary"
              : "text-ink-subtle hover:bg-canvas hover:text-ink"
          }`}
          title={isBookmarked ? "Saved" : "Save post"}
        >
          {isBookmarked ? (
            <HiBookmark className="size-4.5 text-primary" />
          ) : (
            <HiOutlineBookmark className="size-4.5" />
          )}
        </button>
      </div>

      {/* Expandable Comments Section */}
      {showComments && (
        <PostComments
          post={post}
          currentUser={currentUser}
          onCommentCountChange={(newCount) => setCommentsCount(newCount)}
        />
      )}
    </article>
  );
}
