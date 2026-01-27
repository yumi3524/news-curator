import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { StreakBadge } from "./StreakBadge";

/**
 * StreakBadgeコンポーネントのStorybook
 *
 * 連続日数バッジの様々な状態を視覚的に確認できます。
 */
const meta = {
  title: "Components/StreakBadge",
  component: StreakBadge,
  parameters: {
    layout: "centered",
    backgrounds: {
      default: "dark",
      values: [{ name: "dark", value: "#0D0F12" }],
    },
  },
  tags: ["autodocs"],
} satisfies Meta<typeof StreakBadge>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * 1日連続
 */
export const Day1: Story = {
  args: {
    days: 1,
  },
};

/**
 * 3日連続
 */
export const Day3: Story = {
  args: {
    days: 3,
  },
};

/**
 * 7日連続
 */
export const Day7: Story = {
  args: {
    days: 7,
  },
};

/**
 * 14日連続
 */
export const Day14: Story = {
  args: {
    days: 14,
  },
};

/**
 * 30日連続
 */
export const Day30: Story = {
  args: {
    days: 30,
  },
};

/**
 * 最長記録
 */
export const Record: Story = {
  args: {
    days: 21,
    isRecord: true,
  },
};

/**
 * サイズ: Small
 */
export const SizeSmall: Story = {
  args: {
    days: 7,
    size: "sm",
  },
};

/**
 * サイズ: Medium（デフォルト）
 */
export const SizeMedium: Story = {
  args: {
    days: 7,
    size: "md",
  },
};

/**
 * サイズ: Large
 */
export const SizeLarge: Story = {
  args: {
    days: 7,
    size: "lg",
  },
};

/**
 * 最長記録 + Large
 */
export const RecordLarge: Story = {
  args: {
    days: 45,
    size: "lg",
    isRecord: true,
  },
};

/**
 * すべてのサイズ比較
 */
export const AllSizes: Story = {
  args: {
    days: 7,
  },
  render: () => (
    <div className="flex flex-col gap-4 items-start">
      <StreakBadge days={7} size="sm" />
      <StreakBadge days={7} size="md" />
      <StreakBadge days={7} size="lg" />
    </div>
  ),
};
