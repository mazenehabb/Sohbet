import { useState, useRef, type ChangeEvent, type FormEvent } from "react";
import axios, { isAxiosError } from "axios";
import { toast } from "@heroui/react";
import {
  HiOutlinePhoto,
  HiOutlineFaceSmile,
  HiOutlineHashtag,
  HiOutlineGlobeAmericas,
  HiOutlineLockClosed,
  HiOutlineUsers,
  HiXMark,
} from "react-icons/hi2";
import { Button } from "../../../components/ui/Button";
import type { Post, PostUser } from "../../../types/post.type";

interface CreatePostComposerProps {
  currentUser?: PostUser | null;
  onPostCreated: (newPost: Post) => void;
}

export default function CreatePostComposer({
  currentUser,
  onPostCreated,
}: CreatePostComposerProps) {
  const [body, setBody] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [privacy, setPrivacy] = useState<"public" | "followers" | "private">("public");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        toast.danger("File is too large", {
          description: "Please choose an image under 10MB.",
        });
        return;
      }
      setSelectedFile(file);
      const url = URL.createObjectURL(file);
      setImagePreview(url);
      setIsExpanded(true);
    }
  };

  const handleRemoveImage = () => {
    setSelectedFile(null);
    if (imagePreview) {
      URL.revokeObjectURL(imagePreview);
      setImagePreview(null);
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleAddTag = (tag: string) => {
    setBody((prev) => (prev ? `${prev} ${tag}` : tag));
    setIsExpanded(true);
  };

  const handleSubmit = async (e?: FormEvent) => {
    if (e) e.preventDefault();
    const trimmedBody = body.trim();
    if (!trimmedBody && !selectedFile) {
      toast.warning("Empty post", {
        description: "Please share some thoughts or add an image first.",
      });
      return;
    }

    const token = localStorage.getItem("token");

    try {
      setIsSubmitting(true);

      if (token) {
        // Send via real Route Misr Posts API
        const formData = new FormData();
        formData.append("body", trimmedBody || " ");
        if (selectedFile) {
          formData.append("image", selectedFile);
        }

        const { data } = await axios.post(
          "https://route-posts.routemisr.com/posts",
          formData,
          {
            headers: {
              token: token,
            },
          }
        );

        if (data.data?.post) {
          const apiPost: Post = {
            ...data.data.post,
            user: currentUser || {
              _id: data.data.post.user,
              name: "You",
              username: "me",
            },
            likes: [],
            likesCount: 0,
            commentsCount: 0,
          };
          onPostCreated(apiPost);
        } else {
          // Fallback optimistic
          const localPost: Post = {
            _id: `temp_${Date.now()}`,
            id: `temp_${Date.now()}`,
            body: trimmedBody,
            image: imagePreview || undefined,
            privacy,
            createdAt: new Date().toISOString(),
            likes: [],
            likesCount: 0,
            commentsCount: 0,
            user: currentUser || {
              _id: "user_current",
              name: "You",
              username: "you",
            },
          };
          onPostCreated(localPost);
        }

        toast.success("Post published!", {
          description: "Your post is now live in the conversation.",
        });
      } else {
        // Guest mode creation
        const guestPost: Post = {
          _id: `guest_post_${Date.now()}`,
          id: `guest_post_${Date.now()}`,
          body: trimmedBody,
          image: imagePreview || undefined,
          privacy,
          createdAt: new Date().toISOString(),
          likes: [],
          likesCount: 0,
          commentsCount: 0,
          user: currentUser || {
            _id: "guest_user",
            name: "Guest Explorer",
            username: "guest",
            photo: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80",
          },
        };
        onPostCreated(guestPost);

        toast.success("Post shared to your feed!", {
          description: "Sign in to save posts to your permanent profile across devices.",
        });
      }

      // Reset form
      setBody("");
      handleRemoveImage();
      setIsExpanded(false);
    } catch (error) {
      console.error("Create post error:", error);
      if (isAxiosError(error)) {
        toast.danger("Could not create post", {
          description: error.response?.data?.message || "Please check your network and try again.",
        });
      } else {
        toast.danger("Something went wrong", {
          description: "Unable to share post right now.",
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mb-6 overflow-hidden rounded-panel border border-line bg-surface p-4 shadow-sm transition hover:shadow-card sm:p-5">
      <div className="flex gap-3.5">
        <img
          src={
            currentUser?.photo ||
            "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80"
          }
          alt={currentUser?.name || "Your avatar"}
          className="size-11 shrink-0 rounded-full object-cover ring-2 ring-line"
        />

        <div className="flex-1">
          {/* Main textarea */}
          <textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            onFocus={() => setIsExpanded(true)}
            onKeyDown={(e) => {
              if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
                handleSubmit();
              }
            }}
            placeholder={
              currentUser
                ? `What's inspiring you today, ${currentUser.name.split(" ")[0]}?`
                : "What's on your mind? Share a reflection, question, or story..."
            }
            rows={isExpanded ? 3 : 2}
            className="w-full resize-none bg-transparent text-[15px] leading-relaxed text-ink outline-none placeholder:text-ink-subtle"
          />

          {/* Image Preview Box */}
          {imagePreview && (
            <div className="relative mb-3 mt-2 overflow-hidden rounded-xl border border-line bg-canvas">
              <img
                src={imagePreview}
                alt="Selected media preview"
                className="max-h-72 w-full object-cover"
              />
              <button
                type="button"
                onClick={handleRemoveImage}
                aria-label="Remove image"
                className="absolute right-2.5 top-2.5 flex size-8 items-center justify-center rounded-full bg-panel/70 text-white backdrop-blur-sm transition hover:bg-panel"
              >
                <HiXMark className="size-5" />
              </button>
            </div>
          )}

          {/* Quick topic tags row if expanded */}
          {isExpanded && (
            <div className="mb-3 flex flex-wrap items-center gap-1.5 pt-1 text-xs">
              <span className="text-ink-subtle">Popular topics:</span>
              {["#Design2026", "#React19", "#SohbetMoments", "#WebEngineering"].map((tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => handleAddTag(tag)}
                  className="rounded-full bg-primary/5 px-2.5 py-1 font-medium text-primary transition hover:bg-primary/10"
                >
                  {tag}
                </button>
              ))}
            </div>
          )}

          {/* Action Row */}
          <div className="flex flex-wrap items-center justify-between gap-2 border-t border-line/60 pt-3">
            {/* Media & Enhancements */}
            <div className="flex items-center gap-1">
              {/* Photo Upload trigger */}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
                id="post-image-input"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium text-ink-muted transition hover:bg-canvas hover:text-primary"
                title="Add photo or graphic"
              >
                <HiOutlinePhoto className="size-4.5 text-accent" />
                <span className="hidden sm:inline">Photo</span>
              </button>

              {/* Tag trigger */}
              <button
                type="button"
                onClick={() => handleAddTag("#Sohbet")}
                className="flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium text-ink-muted transition hover:bg-canvas hover:text-primary"
                title="Add topic tag"
              >
                <HiOutlineHashtag className="size-4.5 text-primary" />
                <span className="hidden sm:inline">Topic</span>
              </button>

              {/* Mood trigger */}
              <button
                type="button"
                onClick={() => handleAddTag("✨ Feeling inspired")}
                className="flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium text-ink-muted transition hover:bg-canvas hover:text-primary"
                title="Feeling / Mood"
              >
                <HiOutlineFaceSmile className="size-4.5 text-amber-500" />
                <span className="hidden sm:inline">Mood</span>
              </button>
            </div>

            {/* Right side: Privacy selector & Post button */}
            <div className="flex items-center gap-2.5">
              {/* Privacy selector */}
              <div className="relative">
                <select
                  value={privacy}
                  onChange={(e) =>
                    setPrivacy(e.target.value as "public" | "followers" | "private")
                  }
                  aria-label="Post privacy"
                  className="cursor-pointer appearance-none rounded-lg border border-line bg-canvas py-1.5 pl-7 pr-3 text-xs font-medium text-ink-muted transition hover:text-ink focus:border-primary focus:outline-none"
                >
                  <option value="public">Public</option>
                  <option value="followers">Followers</option>
                  <option value="private">Only Me</option>
                </select>
                <div className="pointer-events-none absolute left-2 top-1/2 -translate-y-1/2 text-ink-subtle">
                  {privacy === "public" ? (
                    <HiOutlineGlobeAmericas className="size-3.5" />
                  ) : privacy === "followers" ? (
                    <HiOutlineUsers className="size-3.5" />
                  ) : (
                    <HiOutlineLockClosed className="size-3.5" />
                  )}
                </div>
              </div>

              {/* Submit Button */}
              <Button
                variant="primary"
                size="sm"
                onClick={() => handleSubmit()}
                isLoading={isSubmitting}
                disabled={(!body.trim() && !selectedFile) || isSubmitting}
                className="rounded-field px-4 shadow-button"
              >
                Publish
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
