import { render, screen, fireEvent, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { ThemeSwitcher } from '../ThemeSwitcher';

describe('ThemeSwitcher', () => {
  // window.matchMedia のモック
  const mockMatchMedia = vi.fn();

  beforeEach(() => {
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: mockMatchMedia,
    });

    // localStorageをクリア
    localStorage.clear();

    // documentのclassListをリセット
    document.documentElement.classList.remove('dark');
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('localStorageの設定がない場合、システム設定(ダーク)に従うこと', () => {
    mockMatchMedia.mockImplementation((query) => ({
      matches: query === '(prefers-color-scheme: dark)',
      media: query,
      onchange: null,
      addListener: vi.fn(), // Deprecated
      removeListener: vi.fn(), // Deprecated
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }));

    render(<ThemeSwitcher />);

    // ダークモードになるべき
    expect(document.documentElement.classList.contains('dark')).toBe(true);
    expect(screen.getByText('ダークモード')).toBeInTheDocument();
  });

  it('localStorageの設定がない場合、システム設定(ライト)に従うこと', () => {
    mockMatchMedia.mockImplementation((query) => ({
      matches: false, // Not dark
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }));

    render(<ThemeSwitcher />);

    // ライトモードになるべき
    expect(document.documentElement.classList.contains('dark')).toBe(false);
    expect(screen.getByText('ライトモード')).toBeInTheDocument();
  });

  it('システム設定よりもlocalStorageの設定を優先すること', () => {
    // システムはダーク
    mockMatchMedia.mockImplementation((query) => ({
      matches: true,
      media: query,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }));

    // localStorageはライト
    localStorage.setItem('darkMode', 'false');

    render(<ThemeSwitcher />);

    // ライトモードになるべき
    expect(document.documentElement.classList.contains('dark')).toBe(false);
    expect(screen.getByText('ライトモード')).toBeInTheDocument();
  });

  it('テーマ切り替えが機能し、localStorageに保存されること', () => {
    // ライトモードで開始
    mockMatchMedia.mockImplementation(() => ({ matches: false, addListener: vi.fn(), removeListener: vi.fn(), addEventListener: vi.fn(), removeEventListener: vi.fn(), dispatchEvent: vi.fn() }));

    render(<ThemeSwitcher />);

    const button = screen.getByRole('button');
    expect(screen.getByText('ライトモード')).toBeInTheDocument();

    // ダークモードに切り替え
    fireEvent.click(button);
    expect(screen.getByText('ダークモード')).toBeInTheDocument();
    expect(document.documentElement.classList.contains('dark')).toBe(true);
    expect(localStorage.getItem('darkMode')).toBe('true');

    // ライトモードに戻す
    fireEvent.click(button);
    expect(screen.getByText('ライトモード')).toBeInTheDocument();
    expect(document.documentElement.classList.contains('dark')).toBe(false);
    expect(localStorage.getItem('darkMode')).toBe('false');
  });
});
