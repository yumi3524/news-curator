'use client';

import { useState, useCallback, useMemo } from 'react';
import { USER_STORAGE_KEYS } from '@/app/types/types';
import type { UserCategoryPreferences, CategoryId } from '@/app/types/types';
import { getTagsFromCategories } from '@/app/lib/categoryMapping';

const STORAGE_KEY = USER_STORAGE_KEYS.CATEGORIES;

/** デフォルトの設定値 */
const DEFAULT_PREFERENCES: UserCategoryPreferences = {
  selectedCategories: [],
  isOnboardingCompleted: false,
  updatedAt: new Date().toISOString(),
};

/** LocalStorageから初期値を取得 */
function getInitialPreferences(): UserCategoryPreferences {
  if (typeof window === 'undefined') {
    return { ...DEFAULT_PREFERENCES, updatedAt: new Date().toISOString() };
  }

  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (e) {
    console.error('カテゴリ設定の読み込みエラー:', e);
  }

  return { ...DEFAULT_PREFERENCES, updatedAt: new Date().toISOString() };
}

export interface UseCategoriesReturn {
  /** 選択されたカテゴリID配列 */
  selectedCategories: CategoryId[];
  /** オンボーディング完了済みか */
  isOnboardingCompleted: boolean;
  /** カテゴリを選択 */
  selectCategories: (categories: CategoryId[]) => void;
  /** カテゴリをトグル */
  toggleCategory: (categoryId: CategoryId) => void;
  /** カテゴリ選択をクリア */
  clearCategories: () => void;
  /** オンボーディングを完了（スキップ含む） */
  completeOnboarding: () => void;
  /** 選択カテゴリに対応するタグセット */
  categoryTags: Set<string>;
  /** カテゴリが選択されているか */
  hasSelectedCategories: boolean;
}

/**
 * カテゴリ選択を管理するカスタムフック
 */
export function useCategories(): UseCategoriesReturn {
  const [preferences, setPreferences] = useState<UserCategoryPreferences>(getInitialPreferences);

  /** 設定を更新してLocalStorageに保存する共通処理 */
  const updatePreferences = useCallback(
    (updater: (prev: UserCategoryPreferences) => Partial<UserCategoryPreferences>) => {
      setPreferences((prev) => {
        const newPrefs: UserCategoryPreferences = {
          ...prev,
          ...updater(prev),
          updatedAt: new Date().toISOString(),
        };
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(newPrefs));
        } catch (e) {
          console.error('カテゴリ設定の保存エラー:', e);
        }
        return newPrefs;
      });
    },
    []
  );

  const selectCategories = useCallback(
    (categories: CategoryId[]) => {
      updatePreferences(() => ({ selectedCategories: categories }));
    },
    [updatePreferences]
  );

  const toggleCategory = useCallback(
    (categoryId: CategoryId) => {
      updatePreferences((prev) => {
        const current = prev.selectedCategories;
        const newCategories = current.includes(categoryId)
          ? current.filter((id) => id !== categoryId)
          : [...current, categoryId];
        return { selectedCategories: newCategories };
      });
    },
    [updatePreferences]
  );

  const clearCategories = useCallback(() => {
    updatePreferences(() => ({ selectedCategories: [] }));
  }, [updatePreferences]);

  const completeOnboarding = useCallback(() => {
    updatePreferences(() => ({ isOnboardingCompleted: true }));
  }, [updatePreferences]);

  const categoryTags = useMemo(
    () => getTagsFromCategories(preferences.selectedCategories),
    [preferences.selectedCategories]
  );

  return {
    selectedCategories: preferences.selectedCategories,
    isOnboardingCompleted: preferences.isOnboardingCompleted,
    selectCategories,
    toggleCategory,
    clearCategories,
    completeOnboarding,
    categoryTags,
    hasSelectedCategories: preferences.selectedCategories.length > 0,
  };
}
