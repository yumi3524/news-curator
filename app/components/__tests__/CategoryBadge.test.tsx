import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { CategoryBadge } from '../CategoryBadge';
import type { CategoryId } from '../../lib/categoryMapping';

const context = describe;

describe('CategoryBadge', () => {
  const mockOnClick = vi.fn();

  beforeEach(() => {
    mockOnClick.mockClear();
  });

  const renderBadge = (selectedCategories: CategoryId[] = []) => {
    return render(
      <CategoryBadge
        selectedCategories={selectedCategories}
        onClick={mockOnClick}
      />
    );
  };

  describe('表示', () => {
    context('カテゴリ未選択の場合', () => {
      it('設定アイコンが表示されること', () => {
        renderBadge([]);
        const button = screen.getByRole('button');
        expect(button).toHaveAttribute('aria-label', 'カテゴリ設定（0件選択中）');
      });
    });

    context('1つのカテゴリが選択されている場合', () => {
      it('選択数が正しく表示されること', () => {
        renderBadge(['frontend']);
        expect(screen.getByRole('button')).toHaveAttribute('aria-label', 'カテゴリ設定（1件選択中）');
      });
    });

    context('2つのカテゴリが選択されている場合', () => {
      it('選択数が正しく表示されること', () => {
        renderBadge(['frontend', 'backend']);
        expect(screen.getByRole('button')).toHaveAttribute('aria-label', 'カテゴリ設定（2件選択中）');
      });
    });

    context('3つ以上のカテゴリが選択されている場合', () => {
      it('+Nの形式で追加数が表示されること', () => {
        renderBadge(['frontend', 'backend', 'ai-ml', 'infra-devops']);
        expect(screen.getByText('+2')).toBeInTheDocument();
      });
    });
  });

  describe('インタラクション', () => {
    context('バッジをクリックした場合', () => {
      it('onClickが呼ばれること', () => {
        renderBadge(['frontend']);
        fireEvent.click(screen.getByRole('button'));
        expect(mockOnClick).toHaveBeenCalled();
      });
    });
  });
});
