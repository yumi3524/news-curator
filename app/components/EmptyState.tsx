import { Inbox } from 'lucide-react';

export function EmptyState() {
  return (
    <div className="py-16 text-center">
      <div className="mb-4 flex justify-center text-[var(--color-text-tertiary)]">
        <Inbox className="h-16 w-16" />
      </div>
      <h2 className="mb-2 font-[Sora,sans-serif] text-2xl font-bold text-[var(--color-text-primary)]">
        記事が見つかりませんでした
      </h2>
      <p className="text-base text-[var(--color-text-secondary)]">
        フィルタ条件を変更してみてください
      </p>
    </div>
  );
}
