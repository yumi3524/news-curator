import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import FilterPanel from "./FilterPanel";
import type { Source } from "@/app/types/types";

/**
 * FilterPanelコンポーネントのStorybook
 *
 * フィルタパネルの様々な状態を視覚的に確認できます：
 * - デフォルト状態（フィルタ未選択）
 * - フィルタ選択済み状態
 * - ソース・タグが多い場合
 * - ソース・タグが少ない場合
 *
 * @deprecated タブUIに移行予定
 */
const meta = {
  title: "Feed/FilterPanel",
  component: FilterPanel,
  parameters: {
    layout: "padded",
  },
  tags: ["autodocs"],
  argTypes: {
    onFiltersChange: { action: "filters changed" },
  },
  decorators: [
    (Story) => (
      <div className="w-[320px]">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof FilterPanel>;

export default meta;
type Story = StoryObj<typeof meta>;

/** 利用可能なソース一覧 */
const availableSources: Array<{ id: Source; name: string }> = [
  { id: "qiita", name: "Qiita" },
  { id: "hackernews", name: "Hacker News" },
  { id: "github", name: "GitHub" },
];

/**
 * デフォルト状態
 * フィルタが未選択の初期状態
 */
export const Default: Story = {
  args: {
    availableSources,
    availableTags: ["React", "JavaScript", "TypeScript", "Next.js", "Frontend"],
    filters: {
      selectedSources: [],
      selectedTags: [],
      searchKeyword: "",
    },
    onFiltersChange: () => {},
  },
};

/**
 * フィルタ選択済み
 * ソース、タグ、キーワードがすべて選択されている状態
 */
export const WithFiltersApplied: Story = {
  args: {
    availableSources,
    availableTags: ["React", "JavaScript", "TypeScript", "Next.js", "Frontend"],
    filters: {
      selectedSources: ["qiita", "github"],
      selectedTags: ["React", "TypeScript"],
      searchKeyword: "hooks",
    },
    onFiltersChange: () => {},
  },
};

/**
 * ソースのみ選択
 * ソースだけが選択されている状態
 */
export const WithSourcesOnly: Story = {
  args: {
    availableSources,
    availableTags: ["React", "JavaScript", "TypeScript", "Next.js", "Frontend"],
    filters: {
      selectedSources: ["hackernews"],
      selectedTags: [],
      searchKeyword: "",
    },
    onFiltersChange: () => {},
  },
};

/**
 * タグのみ選択
 * タグだけが選択されている状態
 */
export const WithTagsOnly: Story = {
  args: {
    availableSources,
    availableTags: ["React", "JavaScript", "TypeScript", "Next.js", "Frontend"],
    filters: {
      selectedSources: [],
      selectedTags: ["React", "JavaScript", "Frontend"],
      searchKeyword: "",
    },
    onFiltersChange: () => {},
  },
};

/**
 * キーワードのみ入力
 * キーワード検索だけが入力されている状態
 */
export const WithKeywordOnly: Story = {
  args: {
    availableSources,
    availableTags: ["React", "JavaScript", "TypeScript", "Next.js", "Frontend"],
    filters: {
      selectedSources: [],
      selectedTags: [],
      searchKeyword: "performance optimization",
    },
    onFiltersChange: () => {},
  },
};

/**
 * タグが多い場合
 * 選択肢が多数ある状態でのレイアウト確認
 */
export const ManyTags: Story = {
  args: {
    availableSources,
    availableTags: [
      "React",
      "JavaScript",
      "TypeScript",
      "Next.js",
      "Frontend",
      "Backend",
      "Node.js",
      "Python",
      "Go",
      "Rust",
      "Docker",
      "Kubernetes",
      "AWS",
      "Performance",
      "Security",
      "Testing",
      "CI/CD",
      "DevOps",
    ],
    filters: {
      selectedSources: ["qiita", "github"],
      selectedTags: ["React", "TypeScript", "Next.js", "Frontend"],
      searchKeyword: "",
    },
    onFiltersChange: () => {},
  },
};

/**
 * タグが少ない場合
 * 選択肢が少ない状態でのレイアウト確認
 */
export const FewTags: Story = {
  args: {
    availableSources,
    availableTags: ["React", "JavaScript"],
    filters: {
      selectedSources: [],
      selectedTags: [],
      searchKeyword: "",
    },
    onFiltersChange: () => {},
  },
};

/**
 * すべて選択
 * すべてのソースとタグが選択されている状態
 */
export const AllSelected: Story = {
  args: {
    availableSources,
    availableTags: ["React", "JavaScript", "TypeScript", "Next.js", "Frontend"],
    filters: {
      selectedSources: ["qiita", "hackernews", "github"],
      selectedTags: ["React", "JavaScript", "TypeScript", "Next.js", "Frontend"],
      searchKeyword: "tutorial",
    },
    onFiltersChange: () => {},
  },
};

/**
 * ソース・タグが空の場合
 * データが存在しない状態（エッジケース）
 */
export const EmptySourcesAndTags: Story = {
  args: {
    availableSources: [],
    availableTags: [],
    filters: {
      selectedSources: [],
      selectedTags: [],
      searchKeyword: "",
    },
    onFiltersChange: () => {},
  },
};
