export function LoadingState() {
  const skeletonCards = Array.from({ length: 6 });

  return (
    <div className="grid animate-[fadeIn_0.5s_ease-out_0.3s_both] grid-cols-[repeat(auto-fill,minmax(380px,1fr))] gap-6">
      {skeletonCards.map((_, index) => (
        <div
          key={index}
          className="rounded-[10px] border-[1.5px] border-[var(--color-border)] bg-[var(--color-bg-secondary)] p-6 shadow-[0_1px_3px_rgba(0,0,0,0.05)]"
        >
          {/* Tags skeleton */}
          <div className="mb-4 flex gap-2">
            <div className="h-6 w-[60px] animate-[shimmer_1.5s_infinite] rounded bg-gradient-to-r from-[var(--color-bg-tertiary)] via-[var(--color-border)] to-[var(--color-bg-tertiary)] bg-[length:200%_100%]" />
            <div className="h-6 w-[60px] animate-[shimmer_1.5s_infinite] rounded bg-gradient-to-r from-[var(--color-bg-tertiary)] via-[var(--color-border)] to-[var(--color-bg-tertiary)] bg-[length:200%_100%]" />
          </div>

          {/* Title skeleton */}
          <div className="mb-3 h-7 animate-[shimmer_1.5s_infinite] rounded bg-gradient-to-r from-[var(--color-bg-tertiary)] via-[var(--color-border)] to-[var(--color-bg-tertiary)] bg-[length:200%_100%]" />

          {/* Summary skeleton */}
          <div className="mb-2 h-4 animate-[shimmer_1.5s_infinite] rounded bg-gradient-to-r from-[var(--color-bg-tertiary)] via-[var(--color-border)] to-[var(--color-bg-tertiary)] bg-[length:200%_100%]" />
          <div className="mb-4 h-4 w-4/5 animate-[shimmer_1.5s_infinite] rounded bg-gradient-to-r from-[var(--color-bg-tertiary)] via-[var(--color-border)] to-[var(--color-bg-tertiary)] bg-[length:200%_100%]" />

          {/* Footer skeleton */}
          <div className="mt-4 h-5 animate-[shimmer_1.5s_infinite] rounded bg-gradient-to-r from-[var(--color-bg-tertiary)] via-[var(--color-border)] to-[var(--color-bg-tertiary)] bg-[length:200%_100%]" />
        </div>
      ))}
    </div>
  );
}
