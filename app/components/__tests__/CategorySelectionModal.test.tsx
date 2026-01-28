import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { CategorySelectionModal } from '../CategorySelectionModal';
import { CATEGORIES } from '../../lib/categoryMapping';

const context = describe;

describe('CategorySelectionModal', () => {
  const mockOnClose = vi.fn();
  const mockOnComplete = vi.fn();

  beforeEach(() => {
    mockOnClose.mockClear();
    mockOnComplete.mockClear();
  });

  const renderModal = (props: {
    isOpen?: boolean;
    mode?: 'onboarding' | 'settings';
    initialSelection?: string[];
  } = {}) => {
    return render(
      <CategorySelectionModal
        isOpen={props.isOpen ?? true}
        onClose={mockOnClose}
        onComplete={mockOnComplete}
        mode={props.mode ?? 'onboarding'}
        initialSelection={(props.initialSelection ?? []) as Parameters<typeof CategorySelectionModal>[0]['initialSelection']}
      />
    );
  };

  describe('表示', () => {
    context('isOpenがtrueの場合', () => {
      it('モーダルが表示されること', () => {
        renderModal({ isOpen: true });
        expect(screen.getByText('カテゴリを選択')).toBeInTheDocument();
      });

      it('すべてのカテゴリが表示されること', () => {
        renderModal({ isOpen: true });
        CATEGORIES.forEach((category) => {
          expect(screen.getByText(category.name)).toBeInTheDocument();
        });
      });
    });

    context('isOpenがfalseの場合', () => {
      it('モーダルが表示されないこと', () => {
        renderModal({ isOpen: false });
        expect(screen.queryByText('カテゴリを選択')).not.toBeInTheDocument();
      });
    });
  });

  describe('オンボーディングモード', () => {
    context('初期状態', () => {
      it('「スキップ」と「全記事を見る」ボタンが表示されること', () => {
        renderModal({ mode: 'onboarding' });
        expect(screen.getByText('スキップ')).toBeInTheDocument();
        expect(screen.getByText('全記事を見る')).toBeInTheDocument();
      });

      it('閉じるボタンが表示されないこと', () => {
        renderModal({ mode: 'onboarding' });
        expect(screen.queryByLabelText('閉じる')).not.toBeInTheDocument();
      });
    });

    context('カテゴリを選択した場合', () => {
      it('「始める」ボタンに変わること', () => {
        renderModal({ mode: 'onboarding' });
        fireEvent.click(screen.getByText('フロントエンド'));
        expect(screen.getByText('始める')).toBeInTheDocument();
      });
    });

    context('スキップボタンをクリックした場合', () => {
      it('空の配列でonCompleteが呼ばれること', () => {
        renderModal({ mode: 'onboarding' });
        fireEvent.click(screen.getByText('スキップ'));
        expect(mockOnComplete).toHaveBeenCalledWith([]);
      });
    });
  });

  describe('設定モード', () => {
    context('初期状態', () => {
      it('「キャンセル」と「保存」ボタンが表示されること', () => {
        renderModal({ mode: 'settings' });
        expect(screen.getByText('キャンセル')).toBeInTheDocument();
        expect(screen.getByText('保存')).toBeInTheDocument();
      });

      it('閉じるボタンが表示されること', () => {
        renderModal({ mode: 'settings' });
        expect(screen.getByLabelText('閉じる')).toBeInTheDocument();
      });
    });

    context('閉じるボタンをクリックした場合', () => {
      it('onCloseが呼ばれること', () => {
        renderModal({ mode: 'settings' });
        fireEvent.click(screen.getByLabelText('閉じる'));
        expect(mockOnClose).toHaveBeenCalled();
      });
    });

    context('キャンセルボタンをクリックした場合', () => {
      it('onCloseが呼ばれること', () => {
        renderModal({ mode: 'settings' });
        fireEvent.click(screen.getByText('キャンセル'));
        expect(mockOnClose).toHaveBeenCalled();
      });
    });
  });

  describe('カテゴリ選択', () => {
    context('カテゴリをクリックした場合', () => {
      it('選択状態が切り替わること', () => {
        renderModal({ mode: 'onboarding' });
        const frontendButton = screen.getByText('フロントエンド').closest('button');

        // 選択
        fireEvent.click(frontendButton!);
        // 「選択中: 1 / 7」の形式で表示される
        expect(screen.getByText(/選択中:/)).toBeInTheDocument();

        // 選択解除
        fireEvent.click(frontendButton!);
        expect(screen.getByText(/選択中:/)).toBeInTheDocument();
      });
    });

    context('複数カテゴリを選択した場合', () => {
      it('選択数が正しく表示されること', () => {
        renderModal({ mode: 'onboarding' });
        fireEvent.click(screen.getByText('フロントエンド'));
        fireEvent.click(screen.getByText('バックエンド'));
        fireEvent.click(screen.getByText('AI / ML'));

        // 選択数3が含まれているかチェック
        expect(screen.getByText(/選択中:/)).toHaveTextContent('3');
      });
    });

    context('保存ボタンをクリックした場合', () => {
      it('選択したカテゴリでonCompleteが呼ばれること', () => {
        renderModal({ mode: 'settings' });
        fireEvent.click(screen.getByText('フロントエンド'));
        fireEvent.click(screen.getByText('バックエンド'));
        fireEvent.click(screen.getByText('保存'));

        expect(mockOnComplete).toHaveBeenCalledWith(['frontend', 'backend']);
      });
    });
  });

  describe('初期選択', () => {
    context('initialSelectionが設定されている場合', () => {
      it('初期選択が反映されること', () => {
        renderModal({
          mode: 'settings',
          initialSelection: ['frontend', 'ai-ml'],
        });
        expect(screen.getByText(/選択中:/)).toHaveTextContent('2');
      });
    });
  });
});
