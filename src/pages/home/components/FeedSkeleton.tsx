export default function FeedSkeleton() {
  return (
    <div className="space-y-5 animate-pulse">
      {[1, 2, 3].map((item) => (
        <div
          key={item}
          className="rounded-panel border border-line bg-surface p-5 shadow-sm"
        >
          {/* Header Skeleton */}
          <div className="flex items-center gap-3">
            <div className="size-11 rounded-full bg-line/80" />
            <div className="flex-1 space-y-2">
              <div className="h-3.5 w-32 rounded-full bg-line/80" />
              <div className="h-2.5 w-20 rounded-full bg-line/60" />
            </div>
          </div>

          {/* Body Lines */}
          <div className="mt-4 space-y-2">
            <div className="h-3.5 w-full rounded bg-line/70" />
            <div className="h-3.5 w-4/5 rounded bg-line/70" />
            <div className="h-3.5 w-2/3 rounded bg-line/50" />
          </div>

          {/* Media Skeleton for item 1 & 3 */}
          {item !== 2 && (
            <div className="mt-4 h-64 w-full rounded-xl bg-line/60" />
          )}

          {/* Footer Bar Skeleton */}
          <div className="mt-4 flex items-center justify-between border-t border-line/60 pt-3">
            <div className="flex gap-4">
              <div className="h-5 w-14 rounded-lg bg-line/60" />
              <div className="h-5 w-14 rounded-lg bg-line/60" />
              <div className="h-5 w-14 rounded-lg bg-line/60" />
            </div>
            <div className="size-6 rounded-lg bg-line/60" />
          </div>
        </div>
      ))}
    </div>
  );
}
