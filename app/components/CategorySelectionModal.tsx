'use client';

import { X, Sparkles } from 'lucide-react';
import { useState } from 'react';
import { Button } from './Button';
import { CATEGORIES, type CategoryId } from '../lib/categoryMapping';

interface CategorySelectionModalContentProps {
  onClose: () => void;
  onComplete: (selectedCategories: CategoryId[]) => void;
  initialSelection: CategoryId[];
  mode: 'onboarding' | 'settings';
}

function CategorySelectionModalContent({
  onClose,
  onComplete,
  initialSelection,
  mode,
}: CategorySelectionModalContentProps) {
  const [selectedCategories, setSelectedCategories] = useState<CategoryId[]>(initialSelection);

  const handleCategoryToggle = (categoryId: CategoryId) => {
    setSelectedCategories((prev) =>
      prev.includes(categoryId)
        ? prev.filter((id) => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  const handleComplete = () => {
    onComplete(selectedCategories);
  };

  const handleSkip = () => {
    onComplete([]);
  };

  const isOnboarding = mode === 'onboarding';
  const canComplete = selectedCategories.length > 0;

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center bg-black/50 p-4 animate-[fadeIn_0.2s_ease-out]">
      <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-xl bg-[var(--color-bg-primary)] p-6 shadow-2xl animate-[slideIn_0.3s_ease-out] md:p-8">
        {/* ヘッダー */}
        <div className="mb-6 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2.5">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[var(--color-brand-primary)]/10">
                <Sparkles className="h-4 w-4 text-[var(--color-brand-primary)]" />
              </div>
              <h2 className="text-2xl font-bold text-[var(--color-text-primary)]">
                {isOnboarding ? 'カテゴリを選択' : 'カテゴリ設定'}
              </h2>
            </div>
            <p className="mt-2 text-sm text-[var(--color-text-secondary)]">
              {isOnboarding
                ? '興味のある分野を選んでください'
                : '表示する記事のカテゴリを選択'}
            </p>
          </div>
          {!isOnboarding && (
            <button
              onClick={onClose}
              className="rounded-lg p-2 text-[var(--color-text-secondary)] transition-colors hover:bg-[var(--color-bg-tertiary)] hover:text-[var(--color-text-primary)]"
              aria-label="閉じる"
            >
              <X className="h-6 w-6" />
            </button>
          )}
        </div>

        {/* カテゴリグリッド */}
        <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
          {CATEGORIES.map((category) => {
            const isSelected = selectedCategories.includes(category.id);
            const Icon = category.icon;

            return (
              <button
                key={category.id}
                onClick={() => handleCategoryToggle(category.id)}
                className={`
                  relative flex flex-col items-center gap-2 rounded-xl p-4 transition-all
                  border-2
                  ${isSelected
                    ? 'border-[var(--color-brand-primary)] bg-[var(--color-brand-primary)]/10'
                    : 'border-[var(--color-border)] bg-[var(--color-bg-secondary)] hover:border-[var(--color-border-hover)] hover:bg-[var(--color-bg-tertiary)]'
                  }
                `}
              >
                <div
                  className="flex h-10 w-10 items-center justify-center rounded-full"
                  style={{ backgroundColor: `${category.color}20` }}
                >
                  <Icon
                    className="h-5 w-5"
                    style={{ color: category.color }}
                  />
                </div>
                <div className="text-center">
                  <p className={`text-sm font-semibold ${isSelected ? 'text-[var(--color-brand-primary)]' : 'text-[var(--color-text-primary)]'}`}>
                    {category.name}
                  </p>
                  <p className="mt-0.5 text-xs text-[var(--color-text-tertiary)] line-clamp-1">
                    {category.description}
                  </p>
                </div>
                {isSelected && (
                  <div className="absolute top-2 right-2 h-2 w-2 rounded-full bg-[var(--color-brand-primary)]" />
                )}
              </button>
            );
          })}
        </div>

        {/* 選択状態 */}
        <div className="mb-6 flex items-center justify-center">
          <span className="text-sm text-[var(--color-text-secondary)]">
            選択中: <span className="font-bold text-[var(--color-brand-primary)]">{selectedCategories.length}</span> / {CATEGORIES.length}
          </span>
        </div>

        {/* アクションボタン */}
        <div className="flex gap-3">
          {isOnboarding ? (
            <>
              <Button
                onClick={handleSkip}
                variant="secondary"
                size="lg"
                fullWidth
              >
                スキップ
              </Button>
              <Button
                onClick={handleComplete}
                variant="primary"
                size="lg"
                fullWidth
              >
                {canComplete ? '始める' : '全記事を見る'}
              </Button>
            </>
          ) : (
            <>
              <Button
                onClick={onClose}
                variant="secondary"
                size="lg"
                fullWidth
              >
                キャンセル
              </Button>
              <Button
                onClick={handleComplete}
                variant="primary"
                size="lg"
                fullWidth
              >
                保存
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

interface CategorySelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: (selectedCategories: CategoryId[]) => void;
  initialSelection?: CategoryId[];
  mode: 'onboarding' | 'settings';
}

export function CategorySelectionModal({
  isOpen,
  onClose,
  onComplete,
  initialSelection = [],
  mode,
}: CategorySelectionModalProps) {
  if (!isOpen) return null;

  // keyを使ってモーダルが開くたびにContentを再マウントし、
  // initialSelectionで状態を初期化する
  return (
    <CategorySelectionModalContent
      key={JSON.stringify(initialSelection)}
      onClose={onClose}
      onComplete={onComplete}
      initialSelection={initialSelection}
      mode={mode}
    />
  );
}
