import { useState, useEffect, type FormEvent } from "react";
import axios, { isAxiosError } from "axios";
import { toast } from "@heroui/react";
import { HiPaperAirplane, HiTrash, HiHeart } from "react-icons/hi2";
import type { Post, PostComment, PostUser } from "../../../types/post.type";
import { formatRelativeTime } from "../../../utils/date";

interface PostCommentsProps {
  post: Post;
  currentUser?: PostUser | null;
  onCommentCountChange?: (newCount: number) => void;
}

export default function PostComments({
  post,
  currentUser,
  onCommentCountChange,
}: PostCommentsProps) {
  const [comments, setComments] = useState<PostComment[]>(() => {
    return post.topComment ? [post.topComment] : [];
  });
  const [commentInput, setCommentInput] = useState("");
  const [isLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    let ignore = false;
    const token = localStorage.getItem("token");
    // Only fetch from API if real post id and token available
    if (token && post._id && !post._id.startsWith("mock_") && !post._id.startsWith("temp_") && !post._id.startsWith("guest_")) {
      axios
        .get(`https://route-posts.routemisr.com/posts/${post._id}/comments`, {
          headers: { token },
        })
        .then((res) => {
          if (!ignore && res.data?.data?.comments) {
            setComments(res.data.data.comments);
          }
        })
        .catch((err) => {
          console.warn("Could not load comments for post:", post._id, err);
        });
    }
    return () => {
      ignore = true;
    };
  }, [post._id]);

  const handleSubmitComment = async (e: FormEvent) => {
    e.preventDefault();
    const content = commentInput.trim();
    if (!content) return;

    const token = localStorage.getItem("token");

    const optimisticComment: PostComment = {
      _id: `temp_comment_${Date.now()}`,
      content,
      post: post._id,
      createdAt: new Date().toISOString(),
      likes: [],
      commentCreator: currentUser || {
        _id: "user_current",
        name: "You",
        username: "you",
        photo: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80",
      },
    };

    setComments((prev) => [...prev, optimisticComment]);
    setCommentInput("");
    onCommentCountChange?.((post.commentsCount || 0) + 1);

    if (token && !post._id.startsWith("mock_") && !post._id.startsWith("temp_") && !post._id.startsWith("guest_")) {
      try {
        setIsSubmitting(true);
        const { data } = await axios.post(
          `https://route-posts.routemisr.com/posts/${post._id}/comments`,
          { content },
          { headers: { token } }
        );

        if (data?.data?.comment) {
          // Replace temp comment with server response
          setComments((prev) =>
            prev.map((c) => (c._id === optimisticComment._id ? data.data.comment : c))
          );
        }
      } catch (error) {
        console.error("Add comment error:", error);
        if (isAxiosError(error)) {
          toast.danger("Could not post comment", {
            description: error.response?.data?.message || "Please try again later.",
          });
        }
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    const token = localStorage.getItem("token");
    setComments((prev) => prev.filter((c) => c._id !== commentId));
    onCommentCountChange?.(Math.max(0, (post.commentsCount || 1) - 1));

    if (token && !commentId.startsWith("temp_") && !post._id.startsWith("mock_")) {
      try {
        await axios.delete(
          `https://route-posts.routemisr.com/posts/${post._id}/comments/${commentId}`,
          { headers: { token } }
        );
        toast.success("Comment deleted");
      } catch (err) {
        console.error("Delete comment error:", err);
      }
    }
  };

  return (
    <div className="mt-4 border-t border-line/60 pt-4">
      {/* Comments List */}
      <div className="space-y-3">
        {isLoading && (
          <div className="flex items-center justify-center py-3 text-xs text-ink-subtle">
            <span className="size-4 animate-spin rounded-full border-2 border-primary border-t-transparent mr-2" />
            Loading conversations...
          </div>
        )}

        {comments.length === 0 && !isLoading && (
          <p className="py-2 text-center text-xs text-ink-subtle italic">
            No comments yet. Start the conversation!
          </p>
        )}

        {comments.map((comment) => {
          const isAuthor =
            currentUser &&
            (currentUser._id === comment.commentCreator?._id ||
              comment.commentCreator?.username === currentUser.username);

          return (
            <div key={comment._id} className="group/item flex items-start gap-2.5">
              <img
                src={
                  comment.commentCreator?.photo ||
                  "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80"
                }
                alt={comment.commentCreator?.name || "Commenter"}
                className="size-8 shrink-0 rounded-full object-cover ring-1 ring-line"
              />

              <div className="flex-1 rounded-2xl bg-canvas px-3.5 py-2.5 transition group-hover/item:bg-line/40">
                <div className="flex items-baseline justify-between gap-2">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-semibold text-ink">
                      {comment.commentCreator?.name || "Community Member"}
                    </span>
                    {comment.commentCreator?.username && (
                      <span className="text-[11px] text-ink-subtle">
                        @{comment.commentCreator.username}
                      </span>
                    )}
                  </div>
                  <span className="text-[10px] text-ink-subtle">
                    {formatRelativeTime(comment.createdAt)}
                  </span>
                </div>

                <p className="mt-1 text-xs leading-relaxed text-ink/90">
                  {comment.content}
                </p>

                {/* Sub action row */}
                <div className="mt-2 flex items-center gap-3 text-[11px] text-ink-subtle">
                  <button
                    type="button"
                    className="flex items-center gap-1 hover:text-rose-500 transition"
                  >
                    <HiHeart className="size-3" />
                    <span>Like</span>
                  </button>

                  {isAuthor && (
                    <button
                      type="button"
                      onClick={() => handleDeleteComment(comment._id)}
                      className="flex items-center gap-1 text-ink-subtle opacity-0 transition group-hover/item:opacity-100 hover:text-error"
                      title="Delete your comment"
                    >
                      <HiTrash className="size-3" />
                      <span>Delete</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Comment Input */}
      <form onSubmit={handleSubmitComment} className="mt-3.5 flex items-center gap-2">
        <img
          src={
            currentUser?.photo ||
            "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80"
          }
          alt={currentUser?.name || "Your avatar"}
          className="size-7.5 shrink-0 rounded-full object-cover ring-1 ring-line"
        />

        <div className="relative flex-1">
          <input
            type="text"
            value={commentInput}
            onChange={(e) => setCommentInput(e.target.value)}
            placeholder="Add a thoughtful reply..."
            className="w-full rounded-full border border-line bg-canvas py-2 pl-4 pr-10 text-xs text-ink placeholder:text-ink-subtle focus:border-primary focus:bg-surface focus:outline-none focus:ring-2 focus:ring-accent/15"
          />

          <button
            type="submit"
            disabled={!commentInput.trim() || isSubmitting}
            className="absolute right-1.5 top-1/2 -translate-y-1/2 flex size-6 items-center justify-center rounded-full bg-primary text-white transition hover:bg-primary-strong disabled:cursor-not-allowed disabled:opacity-40"
            title="Send comment"
          >
            <HiPaperAirplane className="size-3" />
          </button>
        </div>
      </form>
    </div>
  );
}
