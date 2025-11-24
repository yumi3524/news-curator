import type { Meta, StoryObj } from "@storybook/react";
import ArticleCard from "./ArticleCard";

/**
 * ArticleCardコンポーネントのStorybook
 * 
 * 様々な状態のArticleCardを視覚的に確認できます:
 * - デフォルト状態
 * - お気に入り登録済み
 * - タグが多い場合
 * - タグがない場合
 * - 長いタイトル
 */
const meta = {
  title: "Feed/ArticleCard",
  component: ArticleCard,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    onToggleFavorite: { action: "favorite toggled" },
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

/**
 * デフォルト状態
 * お気に入り未登録の通常の記事カード
 */
export const Default: Story = {
  args: {
    article: {
      id: "1",
      title: "React 19の新機能と破壊的変更の完全ガイド",
      description:
        "React 19で導入される新しいフック、Server Components、そして注意すべき破壊的変更について詳しく解説します。",
      url: "https://example.com/article/1",
      publishedAt: "2024-11-20T10:00:00Z",
      source: {
        id: "tech-blog",
        name: "Tech Blog",
      },
      author: "山田太郎",
      tags: ["React", "JavaScript", "Frontend"],
      isFavorite: false,
    },
    onToggleFavorite: (id) => console.log("Toggle favorite:", id),
  },
};

/**
 * お気に入り登録済み
 * ハートアイコンが塗りつぶされた状態
 */
export const Favorited: Story = {
  args: {
    article: {
      ...Default.args!.article,
      isFavorite: true,
    },
    onToggleFavorite: (id) => console.log("Toggle favorite:", id),
  },
};

/**
 * タグが多い場合
 * タグが折り返されて表示される
 */
export const ManyTags: Story = {
  args: {
    article: {
      ...Default.args!.article,
      tags: [
        "React",
        "JavaScript",
        "TypeScript",
        "Next.js",
        "Frontend",
        "Web Development",
        "Performance",
      ],
    },
    onToggleFavorite: (id) => console.log("Toggle favorite:", id),
  },
};

/**
 * タグなし
 * タグセクションが表示されない
 */
export const NoTags: Story = {
  args: {
    article: {
      ...Default.args!.article,
      tags: [],
    },
    onToggleFavorite: (id) => console.log("Toggle favorite:", id),
  },
};

/**
 * 長いタイトル
 * タイトルが2行で切り詰められる
 */
export const LongTitle: Story = {
  args: {
    article: {
      ...Default.args!.article,
      title:
        "Next.js 15 App Routerのパフォーマンス最適化テクニック：Server ComponentsとClient Componentsの使い分けから、キャッシング戦略、画像最適化まで徹底解説",
    },
    onToggleFavorite: (id) => console.log("Toggle favorite:", id),
  },
};

/**
 * モバイル表示
 * 狭い画面での表示を確認
 */
export const Mobile: Story = {
  args: Default.args,
  decorators: [
    (Story) => (
      <div className="w-[320px]">
        <Story />
      </div>
    ),
  ],
};

/**
 * デスクトップ表示
 * 広い画面での表示を確認
 */
export const Desktop: Story = {
  args: Default.args,
  decorators: [
    (Story) => (
      <div className="w-[600px]">
        <Story />
      </div>
    ),
  ],
};
