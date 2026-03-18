import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { FilterSection } from '../FilterSection';

const mockProps = {
  searchQuery: '',
  onSearchChange: vi.fn(),
  tags: [
    { name: 'TypeScript', count: 15 },
    { name: 'React', count: 12 },
    { name: 'Next.js', count: 8 },
  ],
  selectedTags: new Set<string>(),
  onTagToggle: vi.fn(),
  filterMode: 'OR' as const,
  onFilterModeChange: vi.fn(),
  activeFilters: [],
  onRemoveFilter: vi.fn(),
  onPersonalSearchClick: vi.fn(),
};

describe('FilterSection', () => {
  it('検索フィールドが表示されること', () => {
    render(<FilterSection {...mockProps} />);

    const searchInput = screen.getByPlaceholderText('キーワードで検索...');
    expect(searchInput).toBeInTheDocument();
  });

  it('検索フィールドが16pxのフォントサイズを持つこと(iOS zoom防止)', () => {
    render(<FilterSection {...mockProps} />);

    const searchInput = screen.getByPlaceholderText('キーワードで検索...');
    expect(searchInput).toHaveClass('text-base'); // text-base = 16px (iOS zoom防止)
  });

  it('検索入力時にonSearchChangeが呼ばれること', () => {
    render(<FilterSection {...mockProps} />);

    const searchInput = screen.getByPlaceholderText('キーワードで検索...');
    fireEvent.change(searchInput, { target: { value: 'test query' } });

    expect(mockProps.onSearchChange).toHaveBeenCalledWith('test query');
  });

  it('タグが表示されること', () => {
    render(<FilterSection {...mockProps} />);

    expect(screen.getByText('TypeScript')).toBeInTheDocument();
    expect(screen.getByText('React')).toBeInTheDocument();
    expect(screen.getByText('Next.js')).toBeInTheDocument();
  });

  it('タグクリック時にonTagToggleが呼ばれること', () => {
    render(<FilterSection {...mockProps} />);

    const typeScriptTag = screen.getByText('TypeScript');
    fireEvent.click(typeScriptTag);

    expect(mockProps.onTagToggle).toHaveBeenCalledWith('TypeScript');
  });



  it('フィルターモード切り替えボタンが表示されること', () => {
    render(<FilterSection {...mockProps} />);

    expect(screen.getByText('OR')).toBeInTheDocument();
    expect(screen.getByText('AND')).toBeInTheDocument();
  });

  it('ORモードボタンがアクティブな状態で表示されること', () => {
    render(<FilterSection {...mockProps} />);

    const orButton = screen.getByText('OR');
    expect(orButton).toHaveClass('bg-[var(--color-brand-primary)]');
  });

  it('ANDモードボタンクリック時にonFilterModeChangeが呼ばれること', () => {
    render(<FilterSection {...mockProps} />);

    const andButton = screen.getByText('AND');
    fireEvent.click(andButton);

    expect(mockProps.onFilterModeChange).toHaveBeenCalledWith('AND');
  });

  it('選択されたタグがハイライト表示されること', () => {
    const propsWithSelectedTag = {
      ...mockProps,
      selectedTags: new Set(['TypeScript']),
    };

    render(<FilterSection {...propsWithSelectedTag} />);

    const typeScriptTag = screen.getByText('TypeScript').closest('button');
    expect(typeScriptTag).toHaveClass('bg-[var(--color-brand-primary)]');
  });



  it('アクティブフィルターが表示されること', () => {
    const propsWithActiveFilters = {
      ...mockProps,
      activeFilters: [
        { type: 'tag' as const, value: 'TypeScript' },
      ],
    };

    render(<FilterSection {...propsWithActiveFilters} />);

    // アクティブフィルターセクションに表示されることを確認
    const activeFilterSection = screen.getAllByText('TypeScript');
    expect(activeFilterSection.length).toBeGreaterThan(1); // タグボタンとアクティブフィルター
  });

  it('ダークモードで選択されたフィルターのテキストが濃い色になること', () => {
    const propsWithSelectedTag = {
      ...mockProps,
      selectedTags: new Set(['TypeScript']),
    };

    render(<FilterSection {...propsWithSelectedTag} />);

    const typeScriptTag = screen.getByText('TypeScript').closest('button');
    expect(typeScriptTag).toHaveClass('text-[var(--color-text-on-accent)]');
  });
});
