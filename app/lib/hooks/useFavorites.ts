import { useState, useCallback } from 'react';
import type { Article } from '@/app/types/types';

const FAVORITES_STORAGE_KEY = 'user:favorites';

/** LocalStorageから初期値を取得 */
function getInitialFavorites(): Map<string, Article> {
  if (typeof window === 'undefined') return new Map();
  try {
    const saved = localStorage.getItem(FAVORITES_STORAGE_KEY);
    if (saved) {
      const parsed: Article[] = JSON.parse(saved);
      const map = new Map<string, Article>();
      parsed.forEach((article) => {
        map.set(article.id, article);
      });
      return map;
    }
  } catch (e) {
    console.error('お気に入りの読み込みエラー:', e);
  }
  return new Map();
}

/** お気に入り記事のIDセットを管理 */
export interface UseFavoritesReturn {
  /** お気に入り記事IDのセット */
  favoriteIds: Set<string>;
  /** 記事がお気に入りかどうか */
  isFavorite: (articleId: string) => boolean;
  /** お気に入りをトグル */
  toggleFavorite: (article: Article) => void;
  /** お気に入りに追加 */
  addFavorite: (article: Article) => void;
  /** お気に入りから削除 */
  removeFavorite: (articleId: string) => void;
  /** すべてのお気に入り記事を取得 */
  getFavoriteArticles: () => Article[];
  /** お気に入り数 */
  count: number;
}

/**
 * お気に入り記事を管理するカスタムフック
 *
 * LocalStorageに記事データを保存し、永続化します。
 */
export function useFavorites(): UseFavoritesReturn {
  const [favorites, setFavorites] = useState<Map<string, Article>>(getInitialFavorites);

  // LocalStorageに保存
  const saveFavorites = useCallback((map: Map<string, Article>) => {
    try {
      const articles = Array.from(map.values());
      localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(articles));
    } catch (e) {
      console.error('お気に入りの保存エラー:', e);
    }
  }, []);

  const favoriteIds = new Set(favorites.keys());

  const isFavorite = useCallback(
    (articleId: string): boolean => {
      return favorites.has(articleId);
    },
    [favorites]
  );

  const addFavorite = useCallback(
    (article: Article) => {
      setFavorites((prev) => {
        const next = new Map(prev);
        next.set(article.id, { ...article, isFavorite: true });
        saveFavorites(next);
        return next;
      });
    },
    [saveFavorites]
  );

  const removeFavorite = useCallback(
    (articleId: string) => {
      setFavorites((prev) => {
        const next = new Map(prev);
        next.delete(articleId);
        saveFavorites(next);
        return next;
      });
    },
    [saveFavorites]
  );

  const toggleFavorite = useCallback(
    (article: Article) => {
      if (favorites.has(article.id)) {
        removeFavorite(article.id);
      } else {
        addFavorite(article);
      }
    },
    [favorites, addFavorite, removeFavorite]
  );

  const getFavoriteArticles = useCallback((): Article[] => {
    return Array.from(favorites.values());
  }, [favorites]);

  return {
    favoriteIds,
    isFavorite,
    toggleFavorite,
    addFavorite,
    removeFavorite,
    getFavoriteArticles,
    count: favorites.size,
  };
}
