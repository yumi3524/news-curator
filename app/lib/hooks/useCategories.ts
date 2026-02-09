'use client';

import { useCallback, useMemo, useSyncExternalStore } from 'react';
import { USER_STORAGE_KEYS } from '@/app/types/types';
import type { UserCategoryPreferences, CategoryId } from '@/app/types/types';
import { getTagsFromCategories } from '@/app/lib/categoryMapping';

const STORAGE_KEY = USER_STORAGE_KEYS.CATEGORIES;

/** デフォルトの設定値 */
const DEFAULT_PREFERENCES: UserCategoryPreferences = {
  selectedCategories: [],
  isOnboardingCompleted: false,
  updatedAt: '',
};

/** キャッシュされたスナップショット */
let cachedSnapshot: UserCategoryPreferences = DEFAULT_PREFERENCES;

/** LocalStorageからカテゴリ設定を読み込み、キャッシュを更新 */
function updateCachedSnapshot(): void {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      cachedSnapshot = JSON.parse(saved);
    } else {
      cachedSnapshot = DEFAULT_PREFERENCES;
    }
  } catch (e) {
    console.error('カテゴリ設定の読み込みエラー:', e);
    cachedSnapshot = DEFAULT_PREFERENCES;
  }
}

/** クライアント用スナップショット取得（キャッシュを返す） */
function getSnapshot(): UserCategoryPreferences {
  return cachedSnapshot;
}

/** SSR時のスナップショット */
function getServerSnapshot(): UserCategoryPreferences {
  return DEFAULT_PREFERENCES;
}

/** 購読用のリスナー管理 */
let listeners: Array<() => void> = [];

function subscribe(listener: () => void): () => void {
  // 初回購読時にLocalStorageから読み込み
  if (listeners.length === 0) {
    updateCachedSnapshot();
  }
  listeners = [...listeners, listener];
  return () => {
    listeners = listeners.filter((l) => l !== listener);
  };
}

function emitChange(): void {
  for (const listener of listeners) {
    listener();
  }
}

/** LocalStorageに保存してキャッシュを更新し、購読者に通知 */
function savePreferences(prefs: UserCategoryPreferences): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(prefs));
    cachedSnapshot = prefs;
  } catch (e) {
    console.error('カテゴリ設定の保存エラー:', e);
  }
  emitChange();
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
  const preferences = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot
  );

  const selectCategories = useCallback((categories: CategoryId[]) => {
    savePreferences({
      ...cachedSnapshot,
      selectedCategories: categories,
      updatedAt: new Date().toISOString(),
    });
  }, []);

  const toggleCategory = useCallback((categoryId: CategoryId) => {
    const newCategories = cachedSnapshot.selectedCategories.includes(categoryId)
      ? cachedSnapshot.selectedCategories.filter((id) => id !== categoryId)
      : [...cachedSnapshot.selectedCategories, categoryId];
    savePreferences({
      ...cachedSnapshot,
      selectedCategories: newCategories,
      updatedAt: new Date().toISOString(),
    });
  }, []);

  const clearCategories = useCallback(() => {
    savePreferences({
      ...cachedSnapshot,
      selectedCategories: [],
      updatedAt: new Date().toISOString(),
    });
  }, []);

  const completeOnboarding = useCallback(() => {
    savePreferences({
      ...cachedSnapshot,
      isOnboardingCompleted: true,
      updatedAt: new Date().toISOString(),
    });
  }, []);

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
