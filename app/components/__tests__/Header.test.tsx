import { render, screen } from '@testing-library/react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { Header } from '../Header';

describe('Header', () => {
  beforeEach(() => {
    // Mock window.matchMedia for ThemeSwitcher
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: vi.fn().mockImplementation(query => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      })),
    });
  });

  it('タイトルが正しく表示されること', () => {
    render(<Header />);

    expect(screen.getByText('News')).toBeInTheDocument();
    expect(screen.getByText('Curator')).toBeInTheDocument();
  });

  it('モバイルで短縮されたサブタイトルが表示されること', () => {
    render(<Header />);

    // モバイル用の短縮テキスト
    const mobileSubtitle = screen.getByText('技術ニュースダッシュボード');
    expect(mobileSubtitle).toBeInTheDocument();
    expect(mobileSubtitle).toHaveClass('md:hidden');
  });

  it('デスクトップで完全なサブタイトルが表示されること', () => {
    render(<Header />);

    // デスクトップ用の完全なテキスト
    const desktopSubtitle = screen.getByText('毎朝3分でキャッチアップできる技術ニュースダッシュボード');
    expect(desktopSubtitle).toBeInTheDocument();
    expect(desktopSubtitle).toHaveClass('hidden', 'md:inline');
  });

  it('モバイル専用の「毎朝3分!」バッジが表示されること', () => {
    render(<Header />);

    const badge = screen.getByText('毎朝3分!');
    expect(badge).toBeInTheDocument();
    expect(badge).toHaveClass('md:hidden');
  });

  it('バッジがCSS変数でテキスト色を指定していること', () => {
    render(<Header />);

    const badge = screen.getByText('毎朝3分!');
    expect(badge).toHaveClass('text-[var(--color-text-on-accent)]');
  });

  it('ThemeSwitcherが表示されること', () => {
    render(<Header />);

    // ThemeSwitcherのボタンが存在することを確認
    const themeSwitcher = screen.getByRole('button');
    expect(themeSwitcher).toBeInTheDocument();
  });

  it('ヘッダーがstickyポジションであること', () => {
    const { container } = render(<Header />);

    const header = container.querySelector('header');
    expect(header).toHaveClass('sticky', 'top-0');
  });
});
