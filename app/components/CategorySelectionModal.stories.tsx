import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { CategorySelectionModal } from './CategorySelectionModal';

const meta = {
  title: 'Components/CategorySelectionModal',
  component: CategorySelectionModal,
  parameters: {
    layout: 'centered',
    backgrounds: {
      default: 'dark',
      values: [{ name: 'dark', value: '#0D0F12' }],
    },
  },
  tags: ['autodocs'],
  args: {
    onClose: () => {},
    onComplete: () => {},
  },
  argTypes: {
    onClose: { action: 'closed' },
    onComplete: { action: 'completed' },
  },
} satisfies Meta<typeof CategorySelectionModal>;

export default meta;
type Story = StoryObj<typeof meta>;

/** オンボーディングモード（初回表示） */
export const Onboarding: Story = {
  args: {
    isOpen: true,
    mode: 'onboarding',
    initialSelection: [],
  },
};

/** オンボーディングモード（一部選択済み） */
export const OnboardingWithSelection: Story = {
  args: {
    isOpen: true,
    mode: 'onboarding',
    initialSelection: ['frontend', 'ai-ml'],
  },
};

/** 設定モード */
export const Settings: Story = {
  args: {
    isOpen: true,
    mode: 'settings',
    initialSelection: ['frontend', 'backend', 'infra-devops'],
  },
};

/** 全選択 */
export const AllSelected: Story = {
  args: {
    isOpen: true,
    mode: 'settings',
    initialSelection: ['frontend', 'backend', 'ai-ml', 'infra-devops', 'mobile', 'security', 'trending'],
  },
};

/** 閉じた状態 */
export const Closed: Story = {
  args: {
    isOpen: false,
    mode: 'onboarding',
    initialSelection: [],
  },
};
