import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { SourceTabs } from "./SourceTabs";

/**
 * SourceTabsコンポーネントのStorybook
 *
 * ソース切り替えタブの様々な状態を視覚的に確認できます。
 */
const meta = {
  title: "Components/SourceTabs",
  component: SourceTabs,
  parameters: {
    layout: "centered",
    backgrounds: {
      default: "dark",
      values: [{ name: "dark", value: "#0D0F12" }],
    },
  },
  tags: ["autodocs"],
  argTypes: {
    onTabChange: { action: "tab changed" },
    activeTab: {
      control: "select",
      options: ["all", "qiita", "hackernews"],
    },
  },
} satisfies Meta<typeof SourceTabs>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * すべてタブがアクティブな状態
 */
export const AllActive: Story = {
  args: {
    activeTab: "all",
    onTabChange: () => {},
    counts: {
      all: 33,
      qiita: 15,
      hackernews: 18,
    },
  },
};

/**
 * Qiitaタブがアクティブな状態
 */
export const QiitaActive: Story = {
  args: {
    activeTab: "qiita",
    onTabChange: () => {},
    counts: {
      all: 33,
      qiita: 15,
      hackernews: 18,
    },
  },
};

/**
 * Hacker Newsタブがアクティブな状態
 */
export const HackerNewsActive: Story = {
  args: {
    activeTab: "hackernews",
    onTabChange: () => {},
    counts: {
      all: 33,
      qiita: 15,
      hackernews: 18,
    },
  },
};

/**
 * カウント表示なし
 */
export const WithoutCounts: Story = {
  args: {
    activeTab: "all",
    onTabChange: () => {},
  },
};

/**
 * 一部のカウントのみ表示
 */
export const PartialCounts: Story = {
  args: {
    activeTab: "qiita",
    onTabChange: () => {},
    counts: {
      qiita: 15,
      hackernews: 8,
    },
  },
};
