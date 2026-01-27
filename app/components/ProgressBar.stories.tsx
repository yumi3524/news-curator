import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { ProgressBar } from "./ProgressBar";

/**
 * ProgressBarコンポーネントのStorybook
 *
 * 進捗表示の様々な状態を視覚的に確認できます。
 */
const meta = {
  title: "Components/ProgressBar",
  component: ProgressBar,
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
      <div className="w-[320px]">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof ProgressBar>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * デフォルト（50%）
 */
export const Default: Story = {
  args: {
    value: 50,
  },
};

/**
 * ラベル付き
 */
export const WithLabel: Story = {
  args: {
    value: 75,
    label: "週間目標達成率",
    subLabel: "15/20記事",
  },
};

/**
 * 0%（空）
 */
export const Empty: Story = {
  args: {
    value: 0,
    label: "今日の進捗",
  },
};

/**
 * 100%（完了）
 */
export const Complete: Story = {
  args: {
    value: 100,
    label: "週間目標",
    subLabel: "達成!",
    variant: "success",
  },
};

/**
 * サイズ: Small
 */
export const SizeSmall: Story = {
  args: {
    value: 60,
    size: "sm",
    label: "Small",
  },
};

/**
 * サイズ: Medium（デフォルト）
 */
export const SizeMedium: Story = {
  args: {
    value: 60,
    size: "md",
    label: "Medium",
  },
};

/**
 * サイズ: Large
 */
export const SizeLarge: Story = {
  args: {
    value: 60,
    size: "lg",
    label: "Large",
  },
};

/**
 * バリアント: Default（info）
 */
export const VariantDefault: Story = {
  args: {
    value: 60,
    variant: "default",
    label: "Default (Info)",
  },
};

/**
 * バリアント: Success
 */
export const VariantSuccess: Story = {
  args: {
    value: 80,
    variant: "success",
    label: "Success",
  },
};

/**
 * バリアント: Warning
 */
export const VariantWarning: Story = {
  args: {
    value: 40,
    variant: "warning",
    label: "Warning",
  },
};

/**
 * バリアント: Accent
 */
export const VariantAccent: Story = {
  args: {
    value: 70,
    variant: "accent",
    label: "Accent",
  },
};

/**
 * カスタム最大値
 */
export const CustomMax: Story = {
  args: {
    value: 7,
    max: 10,
    label: "ストリーク進捗",
    subLabel: "7/10日",
  },
};
