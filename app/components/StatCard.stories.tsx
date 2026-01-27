import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { BookOpen, Flame, Bookmark, Clock } from "lucide-react";
import { StatCard } from "./StatCard";

/**
 * StatCardコンポーネントのStorybook
 *
 * ダッシュボードの統計カードの様々な状態を視覚的に確認できます。
 */
const meta = {
  title: "Components/StatCard",
  component: StatCard,
  parameters: {
    layout: "centered",
    backgrounds: {
      default: "dark",
      values: [{ name: "dark", value: "#0D0F12" }],
    },
  },
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <div className="w-[280px]">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof StatCard>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * 基本的な統計カード
 */
export const Default: Story = {
  args: {
    label: "今週読んだ記事",
    value: 42,
  },
};

/**
 * 上昇トレンド付き
 */
export const WithUpTrend: Story = {
  args: {
    label: "今週読んだ記事",
    value: 42,
    trend: "+12% from last week",
    trendDirection: "up",
  },
};

/**
 * 下降トレンド付き
 */
export const WithDownTrend: Story = {
  args: {
    label: "今週読んだ記事",
    value: 28,
    trend: "-8% from last week",
    trendDirection: "down",
  },
};

/**
 * アイコン付き - 記事数
 */
export const WithIconArticles: Story = {
  args: {
    label: "今週読んだ記事",
    value: 42,
    trend: "+12%",
    trendDirection: "up",
    icon: <BookOpen className="w-5 h-5" />,
  },
};

/**
 * アイコン付き - ストリーク
 */
export const WithIconStreak: Story = {
  args: {
    label: "連続日数",
    value: 7,
    trend: "最長記録達成!",
    trendDirection: "up",
    icon: <Flame className="w-5 h-5" />,
  },
};

/**
 * アイコン付き - ブックマーク
 */
export const WithIconBookmarks: Story = {
  args: {
    label: "保存した記事",
    value: 156,
    icon: <Bookmark className="w-5 h-5" />,
  },
};

/**
 * アイコン付き - 読書時間
 */
export const WithIconReadingTime: Story = {
  args: {
    label: "総読書時間",
    value: "4.5h",
    trend: "+30min",
    trendDirection: "up",
    icon: <Clock className="w-5 h-5" />,
  },
};

/**
 * 大きな数値
 */
export const LargeNumber: Story = {
  args: {
    label: "累計読了記事",
    value: "1,234",
    icon: <BookOpen className="w-5 h-5" />,
  },
};

/**
 * ニュートラルトレンド
 */
export const NeutralTrend: Story = {
  args: {
    label: "今週読んだ記事",
    value: 35,
    trend: "先週と同じ",
    trendDirection: "neutral",
  },
};
