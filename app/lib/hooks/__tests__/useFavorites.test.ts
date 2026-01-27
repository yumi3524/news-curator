import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { useFavorites } from '../useFavorites';
import type { Article } from '@/app/types/types';

const context = describe;

// LocalStorageのモック
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: vi.fn((key: string) => store[key] || null),
    setItem: vi.fn((key: string, value: string) => {
      store[key] = value;
    }),
    removeItem: vi.fn((key: string) => {
      delete store[key];
    }),
    clear: vi.fn(() => {
      store = {};
    }),
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

const mockArticle: Article = {
  id: '1',
  title: 'テスト記事',
  description: 'テスト説明',
  url: 'https://example.com/1',
  publishedAt: '2024-01-01T00:00:00Z',
  source: 'qiita',
  tags: ['React'],
  likesCount: 10,
};

const mockArticle2: Article = {
  id: '2',
  title: 'テスト記事2',
  description: 'テスト説明2',
  url: 'https://example.com/2',
  publishedAt: '2024-01-02T00:00:00Z',
  source: 'hackernews',
  tags: ['Rust'],
  score: 100,
};

describe('useFavorites', () => {
  beforeEach(() => {
    localStorageMock.clear();
    vi.clearAllMocks();
  });

  describe('初期状態', () => {
    context('LocalStorageが空の場合', () => {
      it('お気に入りが空であること', () => {
        const { result } = renderHook(() => useFavorites());

        expect(result.current.count).toBe(0);
        expect(result.current.getFavoriteArticles()).toEqual([]);
      });
    });

    context('LocalStorageにデータがある場合', () => {
      it('保存されたお気に入りが読み込まれること', () => {
        localStorageMock.setItem(
          'user:favorites',
          JSON.stringify([mockArticle])
        );

        const { result } = renderHook(() => useFavorites());

        expect(result.current.count).toBe(1);
        expect(result.current.isFavorite(mockArticle.id)).toBe(true);
      });
    });
  });

  describe('isFavorite', () => {
    context('お気に入りに追加されている場合', () => {
      it('trueを返すこと', () => {
        const { result } = renderHook(() => useFavorites());

        act(() => {
          result.current.addFavorite(mockArticle);
        });

        expect(result.current.isFavorite(mockArticle.id)).toBe(true);
      });
    });

    context('お気に入りに追加されていない場合', () => {
      it('falseを返すこと', () => {
        const { result } = renderHook(() => useFavorites());

        expect(result.current.isFavorite('non-existent')).toBe(false);
      });
    });
  });

  describe('addFavorite', () => {
    context('記事を追加する場合', () => {
      it('お気に入りに追加されること', () => {
        const { result } = renderHook(() => useFavorites());

        act(() => {
          result.current.addFavorite(mockArticle);
        });

        expect(result.current.count).toBe(1);
        expect(result.current.isFavorite(mockArticle.id)).toBe(true);
      });

      it('LocalStorageに保存されること', () => {
        const { result } = renderHook(() => useFavorites());

        act(() => {
          result.current.addFavorite(mockArticle);
        });

        expect(localStorageMock.setItem).toHaveBeenCalledWith(
          'user:favorites',
          expect.any(String)
        );
      });
    });
  });

  describe('removeFavorite', () => {
    context('お気に入りから削除する場合', () => {
      it('お気に入りから削除されること', () => {
        const { result } = renderHook(() => useFavorites());

        act(() => {
          result.current.addFavorite(mockArticle);
        });

        expect(result.current.count).toBe(1);

        act(() => {
          result.current.removeFavorite(mockArticle.id);
        });

        expect(result.current.count).toBe(0);
        expect(result.current.isFavorite(mockArticle.id)).toBe(false);
      });
    });
  });

  describe('toggleFavorite', () => {
    context('お気に入りでない記事をトグルする場合', () => {
      it('お気に入りに追加されること', () => {
        const { result } = renderHook(() => useFavorites());

        act(() => {
          result.current.toggleFavorite(mockArticle);
        });

        expect(result.current.isFavorite(mockArticle.id)).toBe(true);
      });
    });

    context('お気に入りの記事をトグルする場合', () => {
      it('お気に入りから削除されること', () => {
        const { result } = renderHook(() => useFavorites());

        act(() => {
          result.current.addFavorite(mockArticle);
        });

        act(() => {
          result.current.toggleFavorite(mockArticle);
        });

        expect(result.current.isFavorite(mockArticle.id)).toBe(false);
      });
    });
  });

  describe('getFavoriteArticles', () => {
    context('複数の記事がお気に入りにある場合', () => {
      it('すべてのお気に入り記事を取得できること', () => {
        const { result } = renderHook(() => useFavorites());

        act(() => {
          result.current.addFavorite(mockArticle);
          result.current.addFavorite(mockArticle2);
        });

        const favorites = result.current.getFavoriteArticles();
        expect(favorites).toHaveLength(2);
        expect(favorites.map((a) => a.id)).toContain(mockArticle.id);
        expect(favorites.map((a) => a.id)).toContain(mockArticle2.id);
      });
    });
  });

  describe('favoriteIds', () => {
    context('お気に入りがある場合', () => {
      it('IDのSetを取得できること', () => {
        const { result } = renderHook(() => useFavorites());

        act(() => {
          result.current.addFavorite(mockArticle);
          result.current.addFavorite(mockArticle2);
        });

        expect(result.current.favoriteIds.has(mockArticle.id)).toBe(true);
        expect(result.current.favoriteIds.has(mockArticle2.id)).toBe(true);
        expect(result.current.favoriteIds.size).toBe(2);
      });
    });
  });
});
