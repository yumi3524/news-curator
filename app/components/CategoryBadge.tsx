'use client';

import { Settings } from 'lucide-react';
import { CATEGORIES, type CategoryId } from '../lib/categoryMapping';

interface CategoryBadgeProps {
  selectedCategories: CategoryId[];
  onClick: () => void;
}

/** 表示するカテゴリの最大数 */
const MAX_DISPLAY_CATEGORIES = 2;

export function CategoryBadge({ selectedCategories, onClick }: CategoryBadgeProps) {
  const count = selectedCategories.length;
  const hasSelection = count > 0;

  // 選択中のカテゴリのアイコンを最大2つ表示
  const displayCategories = selectedCategories
    .slice(0, MAX_DISPLAY_CATEGORIES)
    .map((id) => CATEGORIES.find((c) => c.id === id))
    .filter((cat): cat is NonNullable<typeof cat> => cat !== undefined);

  return (
    <button
      onClick={onClick}
      className={`
        flex items-center gap-1.5 rounded-lg px-2.5 py-1.5
        transition-all duration-200
        ${hasSelection
          ? 'bg-[var(--color-accent-subtle)] text-[var(--color-accent-primary)]'
          : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-white/[0.05]'
        }
      `}
      aria-label={`カテゴリ設定（${count}件選択中）`}
      title="カテゴリ設定"
    >
      {hasSelection ? (
        <>
          <div className="flex -space-x-1">
            {displayCategories.map((cat) => {
              const Icon = cat.icon;
              return (
                <div
                  key={cat.id}
                  className="flex h-5 w-5 items-center justify-center rounded-full bg-[var(--color-bg-primary)]"
                  style={{ borderColor: cat.color, borderWidth: 1 }}
                >
                  <Icon className="h-3 w-3" style={{ color: cat.color }} />
                </div>
              );
            })}
          </div>
          {count > MAX_DISPLAY_CATEGORIES && (
            <span className="text-xs font-medium">+{count - MAX_DISPLAY_CATEGORIES}</span>
          )}
        </>
      ) : (
        <Settings className="h-[18px] w-[18px]" />
      )}
    </button>
  );
}
