import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { ArticleCard } from './ArticleCard';

const meta = {
  title: 'Components/ArticleCard',
  component: ArticleCard,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    onToggleFavorite: { action: 'favorite toggled' },
    onTagClick: { action: 'tag clicked' },
  },
  decorators: [
    (Story) => (
      <div className="w-[400px]">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof ArticleCard>;

export default meta;
type Story = StoryObj<typeof meta>;

import type { Article } from '../types/types';

const baseArticle: Article = {
  id: '1',
  title: 'React 19の新機能と破壊的変更の完全ガイド',
  description: 'React 19で導入される新機能について解説します',
  url: 'https://example.com/article/1',
  publishedAt: '2024-11-20T10:00:00Z',
  source: 'qiita',
  tags: ['React', 'JavaScript', 'Frontend'],
  likesCount: 42,
  stocksCount: 15,
};

/** デフォルト状態 */
export const Default: Story = {
  args: {
    article: baseArticle,
  },
};

/** お気に入り機能付き */
export const WithFavorite: Story = {
  args: {
    article: baseArticle,
    onToggleFavorite: (id) => console.log('Toggle favorite:', id),
  },
};

/** お気に入り登録済み */
export const Favorited: Story = {
  args: {
    article: { ...baseArticle, isFavorite: true },
    onToggleFavorite: (id) => console.log('Toggle favorite:', id),
  },
};

/** タグが多い場合 */
export const ManyTags: Story = {
  args: {
    article: {
      ...baseArticle,
      tags: ['React', 'JavaScript', 'TypeScript', 'Next.js', 'Frontend', 'Web', 'Performance'],
    },
  },
};

/** タグなし */
export const NoTags: Story = {
  args: {
    article: { ...baseArticle, tags: [] },
  },
};

/** 長いタイトル */
export const LongTitle: Story = {
  args: {
    article: {
      ...baseArticle,
      title: 'Next.js 15 App Routerのパフォーマンス最適化テクニック：Server ComponentsとClient Componentsの使い分けから、キャッシング戦略、画像最適化まで徹底解説',
    },
  },
};
