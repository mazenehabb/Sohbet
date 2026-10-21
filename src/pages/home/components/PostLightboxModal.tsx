import { useEffect } from "react";
import { HiXMark, HiArrowDownTray } from "react-icons/hi2";

interface PostLightboxModalProps {
  imageUrl: string;
  authorName?: string;
  onClose: () => void;
}

export default function PostLightboxModal({
  imageUrl,
  authorName,
  onClose,
}: PostLightboxModalProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 backdrop-blur-md transition"
      onClick={onClose}
    >
      <div
        className="relative max-h-[90vh] max-w-5xl overflow-hidden rounded-panel shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Control Bar */}
        <div className="absolute inset-x-0 top-0 z-10 flex items-center justify-between bg-gradient-to-b from-black/70 to-transparent p-4 text-white">
          <p className="text-sm font-medium drop-shadow-sm">
            {authorName ? `Photo by ${authorName}` : "Media Preview"}
          </p>
          <div className="flex items-center gap-2">
            <a
              href={imageUrl}
              target="_blank"
              rel="noopener noreferrer"
              download
              className="flex size-9 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm transition hover:bg-white/30"
              title="Open full size / Download"
            >
              <HiArrowDownTray className="size-4.5" />
            </a>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close preview"
              className="flex size-9 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm transition hover:bg-white/30"
            >
              <HiXMark className="size-5" />
            </button>
          </div>
        </div>

        {/* The Image */}
        <img
          src={imageUrl}
          alt={authorName ? `Photo by ${authorName}` : "Post media"}
          className="max-h-[85vh] w-auto max-w-full rounded-panel object-contain"
        />
      </div>
    </div>
  );
}
