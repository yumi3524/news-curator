import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { Dashboard } from './Dashboard';

/**
 * Dashboardコンポーネントのストーリー
 *
 * ダッシュボード画面の様々な状態を視覚的に確認できます。
 */
const meta = {
  title: 'Pages/Dashboard',
  component: Dashboard,
  parameters: {
    layout: 'fullscreen',
    backgrounds: {
      default: 'dark',
      values: [{ name: 'dark', value: '#0D0F12' }],
    },
    // MSWでAPIをモック
    msw: {
      handlers: [],
    },
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Dashboard>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * デフォルト状態
 *
 * ダッシュボードの通常表示です。
 */
export const Default: Story = {
  parameters: {
    mockData: [
      {
        url: '/api/articles',
        method: 'GET',
        status: 200,
        response: {
          articles: [
            {
              id: '1',
              title: 'React 19の新機能と破壊的変更の完全ガイド',
              description: 'React 19で導入される新機能について解説します。use()フック、Server Componentsの改善など。',
              url: 'https://qiita.com/example/article/1',
              publishedAt: '2024-11-20T10:00:00Z',
              source: 'qiita',
              tags: ['React', 'JavaScript', 'Frontend'],
              likesCount: 42,
              stocksCount: 15,
              readingTimeMinutes: 8,
              isFavorite: true,
            },
            {
              id: '2',
              title: 'Show HN: I built a new programming language',
              description: 'A new systems programming language focusing on memory safety.',
              url: 'https://news.ycombinator.com/item?id=12345',
              publishedAt: '2024-11-20T08:00:00Z',
              source: 'hackernews',
              tags: ['Programming', 'Rust'],
              score: 256,
              commentsCount: 89,
              isTranslated: true,
              isFavorite: true,
            },
            {
              id: '3',
              title: 'vercel/next.js: The React Framework',
              description: 'The React Framework for Production.',
              url: 'https://github.com/vercel/next.js',
              publishedAt: '2024-11-19T15:00:00Z',
              source: 'github',
              tags: ['Next.js', 'React', 'Framework'],
              stars: 125000,
              forks: 26500,
              language: 'TypeScript',
              isFavorite: true,
            },
          ],
        },
      },
    ],
  },
};

/**
 * ローディング状態
 *
 * データ読み込み中の表示です。
 */
export const Loading: Story = {
  parameters: {
    mockData: [
      {
        url: '/api/articles',
        method: 'GET',
        status: 200,
        delay: 999999,
        response: { articles: [] },
      },
    ],
  },
};

/**
 * お気に入りなし
 *
 * お気に入り記事がない場合の表示です。
 */
export const NoFavorites: Story = {
  parameters: {
    mockData: [
      {
        url: '/api/articles',
        method: 'GET',
        status: 200,
        response: { articles: [] },
      },
    ],
  },
};
