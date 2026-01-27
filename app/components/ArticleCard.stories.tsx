import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { ArticleCard } from './ArticleCard';
import type { Article } from '../types/types';

const meta = {
  title: 'Components/ArticleCard',
  component: ArticleCard,
  parameters: {
    layout: 'centered',
    backgrounds: {
      default: 'dark',
      values: [{ name: 'dark', value: '#0D0F12' }],
    },
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

/** Qiita記事 */
const qiitaArticle: Article = {
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
};

/** Hacker News記事 */
const hnArticle: Article = {
  id: '2',
  title: 'Show HN: I built a new programming language',
  description: 'A new systems programming language focusing on memory safety and performance.',
  url: 'https://news.ycombinator.com/item?id=12345',
  publishedAt: '2024-11-20T08:00:00Z',
  source: 'hackernews',
  tags: ['Programming', 'Rust', 'Systems'],
  score: 256,
  commentsCount: 89,
  isTranslated: true,
  titleJa: 'Show HN: 新しいプログラミング言語を作りました',
  descriptionJa: 'メモリ安全性とパフォーマンスに焦点を当てた新しいシステムプログラミング言語です。',
};

/** GitHub記事 */
const githubArticle: Article = {
  id: '3',
  title: 'vercel/next.js: The React Framework',
  description: 'The React Framework for Production. Built on React, Next.js provides a best-in-class developer experience.',
  url: 'https://github.com/vercel/next.js',
  publishedAt: '2024-11-19T15:00:00Z',
  source: 'github',
  tags: ['Next.js', 'React', 'Framework'],
  stars: 125000,
  forks: 26500,
  language: 'TypeScript',
};

/** デフォルト状態（Qiita） */
export const Default: Story = {
  args: {
    article: qiitaArticle,
  },
};

/** Qiita記事 */
export const Qiita: Story = {
  args: {
    article: qiitaArticle,
  },
};

/** Hacker News記事 */
export const HackerNews: Story = {
  args: {
    article: hnArticle,
  },
};

/** GitHub記事 */
export const GitHub: Story = {
  args: {
    article: githubArticle,
  },
};

/** お気に入り機能付き */
export const WithFavorite: Story = {
  args: {
    article: qiitaArticle,
    onToggleFavorite: (id) => console.log('Toggle favorite:', id),
  },
};

/** お気に入り登録済み */
export const Favorited: Story = {
  args: {
    article: { ...qiitaArticle, isFavorite: true },
    onToggleFavorite: (id) => console.log('Toggle favorite:', id),
  },
};

/** 翻訳済みHN記事 */
export const TranslatedHN: Story = {
  args: {
    article: hnArticle,
  },
};

/** タグが多い場合 */
export const ManyTags: Story = {
  args: {
    article: {
      ...qiitaArticle,
      tags: ['React', 'JavaScript', 'TypeScript', 'Next.js', 'Frontend', 'Web', 'Performance'],
    },
  },
};

/** タグなし */
export const NoTags: Story = {
  args: {
    article: { ...qiitaArticle, tags: [] },
  },
};

/** 長いタイトル */
export const LongTitle: Story = {
  args: {
    article: {
      ...qiitaArticle,
      title: 'Next.js 15 App Routerのパフォーマンス最適化テクニック：Server ComponentsとClient Componentsの使い分けから、キャッシング戦略、画像最適化まで徹底解説',
    },
  },
};

/** 読了時間付き */
export const WithReadingTime: Story = {
  args: {
    article: {
      ...qiitaArticle,
      readingTimeMinutes: 12,
    },
  },
};

/** すべてのソースを並べて表示 */
export const AllSources: Story = {
  args: {
    article: qiitaArticle,
  },
  render: () => (
    <div className="flex flex-col gap-4 w-[400px]">
      <ArticleCard article={qiitaArticle} />
      <ArticleCard article={hnArticle} />
      <ArticleCard article={githubArticle} />
    </div>
  ),
};
