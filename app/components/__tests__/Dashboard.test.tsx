import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Dashboard } from '../Dashboard';
import type { Article } from '@/app/types/types';

const context = describe;

// お気に入り記事のモック
const mockFavoriteArticles: Article[] = [
  {
    id: '1',
    title: 'React 19の新機能',
    description: 'React 19について解説します',
    url: 'https://example.com/1',
    publishedAt: '2024-01-01T00:00:00Z',
    source: 'qiita',
    tags: ['React'],
    likesCount: 100,
    isFavorite: true,
  },
  {
    id: '2',
    title: 'Rust入門',
    description: 'Rustの基本を学びます',
    url: 'https://example.com/2',
    publishedAt: '2024-01-02T00:00:00Z',
    source: 'hackernews',
    tags: ['Rust'],
    score: 200,
    isFavorite: true,
  },
  {
    id: '3',
    title: 'Next.jsリポジトリ',
    description: 'Next.jsのソースコード',
    url: 'https://example.com/3',
    publishedAt: '2024-01-03T00:00:00Z',
    source: 'github',
    tags: ['Next.js'],
    stars: 1000,
    isFavorite: true,
  },
];

// LocalStorageのモック
const localStorageMock = {
  store: {} as Record<string, string>,
  getItem: vi.fn((key: string) => localStorageMock.store[key] ?? null),
  setItem: vi.fn((key: string, value: string) => {
    localStorageMock.store[key] = value;
  }),
  removeItem: vi.fn((key: string) => {
    delete localStorageMock.store[key];
  }),
  clear: vi.fn(() => {
    localStorageMock.store = {};
  }),
};

describe('Dashboard', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorageMock.store = {};
    Object.defineProperty(window, 'localStorage', {
      value: localStorageMock,
      writable: true,
    });
  });

  describe('基本表示', () => {
    context('初期表示の場合', () => {
      it('ページタイトルが表示されること', async () => {
        render(<Dashboard />);

        expect(screen.getByText('ダッシュボード')).toBeInTheDocument();
        expect(
          screen.getByText('あなたの読書統計とお気に入り記事')
        ).toBeInTheDocument();
      });

      it('統計カードが4つ表示されること', async () => {
        render(<Dashboard />);

        await waitFor(() => {
          expect(screen.getAllByTestId('stat-card')).toHaveLength(4);
        });
      });

      it('週間目標プログレスバーが表示されること', async () => {
        render(<Dashboard />);

        expect(screen.getByText('週間目標達成率')).toBeInTheDocument();
        expect(screen.getByTestId('progress-bar')).toBeInTheDocument();
      });

      it('ストリークバッジが表示されること', async () => {
        render(<Dashboard />);

        expect(screen.getByTestId('streak-badge')).toBeInTheDocument();
        expect(screen.getByText('連続学習記録')).toBeInTheDocument();
      });
    });
  });

  describe('統計カード', () => {
    context('統計データが表示される場合', () => {
      it('今週読んだ記事数が表示されること', async () => {
        render(<Dashboard />);

        expect(screen.getByText('今週読んだ記事')).toBeInTheDocument();
        expect(screen.getByText('42')).toBeInTheDocument();
      });

      it('総読書時間が表示されること', async () => {
        render(<Dashboard />);

        expect(screen.getByText('総読書時間')).toBeInTheDocument();
        expect(screen.getByText('186分')).toBeInTheDocument();
      });

      it('お気に入り数が表示されること', async () => {
        render(<Dashboard />);

        expect(screen.getByText('お気に入り')).toBeInTheDocument();
      });

      it('連続日数が表示されること', async () => {
        render(<Dashboard />);

        expect(screen.getByText('連続日数')).toBeInTheDocument();
        // StatCardのvalueとStreakBadgeの両方で7が表示される
        const sevens = screen.getAllByText('7');
        expect(sevens.length).toBeGreaterThanOrEqual(1);
      });
    });
  });

  describe('お気に入り記事', () => {
    context('お気に入りがない場合', () => {
      it('お気に入り記事セクションが表示されること', async () => {
        render(<Dashboard />);

        expect(screen.getByText('お気に入り記事')).toBeInTheDocument();
      });

      it('空の状態メッセージが表示されること', async () => {
        render(<Dashboard />);

        expect(screen.getByText('お気に入り記事がありません')).toBeInTheDocument();
      });
    });

    context('お気に入りがある場合', () => {
      beforeEach(() => {
        // LocalStorageにお気に入りをセット（キーはuser:favorites）
        localStorageMock.store['user:favorites'] = JSON.stringify(mockFavoriteArticles);
      });

      it('記事カードが表示されること', async () => {
        render(<Dashboard />);

        await waitFor(() => {
          expect(screen.getAllByTestId('article-card').length).toBe(3);
        });
      });

      it('すべてタブをクリックすると全記事が表示されること', async () => {
        const user = userEvent.setup();
        render(<Dashboard />);

        await waitFor(() => {
          expect(screen.getAllByTestId('article-card').length).toBe(3);
        });

        const allTab = screen.getByRole('tab', { name: /すべて/i });
        await user.click(allTab);

        expect(screen.getAllByTestId('article-card').length).toBe(3);
      });

      it('Qiitaタブをクリックするとqiita記事のみ表示されること', async () => {
        const user = userEvent.setup();
        render(<Dashboard />);

        await waitFor(() => {
          expect(screen.getAllByTestId('article-card').length).toBe(3);
        });

        const qiitaTab = screen.getByRole('tab', { name: /Qiita/i });
        await user.click(qiitaTab);

        await waitFor(() => {
          expect(screen.getAllByTestId('article-card').length).toBe(1);
        });
      });
    });
  });

});
