import { useState } from "react";
import { HiPlus } from "react-icons/hi2";
import type { PostUser } from "../../../types/post.type";

interface StoryItem {
  id: string;
  user: PostUser;
  imageUrl: string;
  hasUnseen: boolean;
}

const mockStories: StoryItem[] = [
  {
    id: "story_1",
    user: {
      _id: "s_user_1",
      name: "Nouran Ali",
      username: "nouran_design",
      photo: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
    },
    imageUrl: "https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?auto=format&fit=crop&w=600&q=80",
    hasUnseen: true,
  },
  {
    id: "story_2",
    user: {
      _id: "s_user_2",
      name: "Omar Hassan",
      username: "omarh",
      photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80",
    },
    imageUrl: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=600&q=80",
    hasUnseen: true,
  },
  {
    id: "story_3",
    user: {
      _id: "s_user_3",
      name: "Layla Zaki",
      username: "laylaz",
      photo: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80",
    },
    imageUrl: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=600&q=80",
    hasUnseen: false,
  },
  {
    id: "story_4",
    user: {
      _id: "s_user_4",
      name: "Karim Fouad",
      username: "karim_f",
      photo: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80",
    },
    imageUrl: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=600&q=80",
    hasUnseen: true,
  },
  {
    id: "story_5",
    user: {
      _id: "s_user_5",
      name: "Salma Samir",
      username: "salma_s",
      photo: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=200&q=80",
    },
    imageUrl: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=600&q=80",
    hasUnseen: false,
  },
];

interface StoriesRailProps {
  currentUser?: PostUser | null;
  onOpenStory?: (story: StoryItem) => void;
}

export default function StoriesRail({ currentUser, onOpenStory }: StoriesRailProps) {
  const [activeStory, setActiveStory] = useState<StoryItem | null>(null);

  const handleStoryClick = (story: StoryItem) => {
    setActiveStory(story);
    onOpenStory?.(story);
  };

  return (
    <>
      <div className="relative mb-6 rounded-panel border border-line bg-surface p-4 shadow-sm">
        <div className="mb-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="flex size-2 rounded-full bg-accent animate-pulse" />
            <h2 className="text-sm font-semibold tracking-tight text-ink">Moments & Stories</h2>
          </div>
          <span className="text-xs font-medium text-ink-muted">24h highlights</span>
        </div>

        <div className="flex items-center gap-3.5 overflow-x-auto pb-1 scrollbar-none">
          {/* Create Story item */}
          <button
            type="button"
            className="group relative flex w-18 shrink-0 flex-col items-center focus:outline-none"
            title="Create your story"
          >
            <div className="relative flex size-16 items-center justify-center rounded-full border-2 border-dashed border-accent/40 bg-canvas transition group-hover:border-accent group-hover:scale-105">
              <img
                src={currentUser?.photo || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80"}
                alt="Your profile"
                className="size-13 rounded-full object-cover"
              />
              <span className="absolute -bottom-1 -right-1 flex size-5 items-center justify-center rounded-full bg-primary text-white shadow-sm ring-2 ring-surface transition group-hover:bg-primary-strong">
                <HiPlus className="size-3.5 stroke-2" />
              </span>
            </div>
            <span className="mt-1.5 w-full truncate text-center text-xs font-medium text-ink">
              Your story
            </span>
          </button>

          {/* User Stories */}
          {mockStories.map((story) => (
            <button
              key={story.id}
              type="button"
              onClick={() => handleStoryClick(story)}
              className="group relative flex w-18 shrink-0 flex-col items-center focus:outline-none"
            >
              <div
                className={`relative flex size-16 items-center justify-center rounded-full p-[2.5px] transition group-hover:scale-105 ${
                  story.hasUnseen
                    ? "bg-gradient-to-tr from-primary via-accent to-rose-400 shadow-sm"
                    : "bg-line"
                }`}
              >
                <div className="size-full overflow-hidden rounded-full ring-2 ring-surface">
                  <img
                    src={story.user.photo || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80"}
                    alt={story.user.name}
                    className="size-full object-cover transition duration-300 group-hover:scale-110"
                    loading="lazy"
                  />
                </div>
              </div>
              <span className="mt-1.5 w-full truncate text-center text-xs font-medium text-ink-muted group-hover:text-ink">
                {story.user.name.split(" ")[0]}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Story Viewer Modal */}
      {activeStory && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center bg-panel/80 p-4 backdrop-blur-md transition"
          onClick={() => setActiveStory(null)}
        >
          <div
            className="relative max-h-[85vh] w-full max-w-sm overflow-hidden rounded-panel bg-panel shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Story Header */}
            <div className="absolute inset-x-0 top-0 z-10 bg-gradient-to-b from-panel/90 to-transparent p-4">
              <div className="mb-2 h-1 w-full overflow-hidden rounded-full bg-white/20">
                <div className="h-full w-2/3 bg-white" />
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <img
                    src={activeStory.user.photo}
                    alt={activeStory.user.name}
                    className="size-8 rounded-full object-cover ring-2 ring-white/60"
                  />
                  <div>
                    <p className="text-xs font-semibold text-white">{activeStory.user.name}</p>
                    <p className="text-[10px] text-panel-muted">@{activeStory.user.username} • 3h ago</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setActiveStory(null)}
                  className="rounded-full bg-black/40 p-1.5 text-white/80 hover:bg-black/60 hover:text-white"
                >
                  ✕
                </button>
              </div>
            </div>

            {/* Story Media */}
            <img
              src={activeStory.imageUrl}
              alt="Story snapshot"
              className="h-[520px] w-full object-cover"
            />
          </div>
        </div>
      )}
    </>
  );
}
