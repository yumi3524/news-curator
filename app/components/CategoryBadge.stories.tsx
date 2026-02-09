import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { CategoryBadge } from './CategoryBadge';

const meta = {
  title: 'Components/CategoryBadge',
  component: CategoryBadge,
  parameters: {
    layout: 'centered',
    backgrounds: {
      default: 'dark',
      values: [{ name: 'dark', value: '#0D0F12' }],
    },
  },
  tags: ['autodocs'],
  args: {
    onClick: () => {},
  },
  argTypes: {
    onClick: { action: 'clicked' },
  },
} satisfies Meta<typeof CategoryBadge>;

export default meta;
type Story = StoryObj<typeof meta>;

/** 未選択 */
export const NoSelection: Story = {
  args: {
    selectedCategories: [],
  },
};

/** 1つ選択 */
export const OneSelected: Story = {
  args: {
    selectedCategories: ['frontend'],
  },
};

/** 2つ選択 */
export const TwoSelected: Story = {
  args: {
    selectedCategories: ['frontend', 'ai-ml'],
  },
};

/** 3つ以上選択 */
export const MultipleSelected: Story = {
  args: {
    selectedCategories: ['frontend', 'backend', 'ai-ml', 'infra-devops'],
  },
};

/** 全選択 */
export const AllSelected: Story = {
  args: {
    selectedCategories: ['frontend', 'backend', 'ai-ml', 'infra-devops', 'mobile', 'security', 'trending'],
  },
};
