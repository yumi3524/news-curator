import { render, screen } from '@testing-library/react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { Header } from '../Header';

const context = describe;

// usePathname のモック
vi.mock('next/navigation', () => ({
  usePathname: vi.fn(() => '/'),
}));

describe('Header', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('基本表示', () => {
    context('初期表示の場合', () => {
      it('タイトルが正しく表示されること', () => {
        render(<Header />);

        expect(screen.getByText('Tech')).toBeInTheDocument();
        expect(screen.getByText('Feed')).toBeInTheDocument();
      });

      it('ヘッダーがstickyポジションであること', () => {
        const { container } = render(<Header />);

        const header = container.querySelector('header');
        expect(header).toHaveClass('sticky', 'top-0');
      });

      it('ThemeSwitcherが表示されること', () => {
        render(<Header />);

        const themeSwitcher = screen.getByRole('button');
        expect(themeSwitcher).toBeInTheDocument();
      });
    });
  });

  describe('ナビゲーション', () => {
    context('ナビゲーションリンクが表示される場合', () => {
      it('フィードリンクが表示されること', () => {
        render(<Header />);

        const feedLink = screen.getByTestId('nav-link-feed');
        expect(feedLink).toBeInTheDocument();
        expect(feedLink).toHaveAttribute('href', '/');
      });

      it('ダッシュボードリンクが表示されること', () => {
        render(<Header />);

        const dashboardLink = screen.getByTestId('nav-link-dashboard');
        expect(dashboardLink).toBeInTheDocument();
        expect(dashboardLink).toHaveAttribute('href', '/dashboard');
      });

      it('ナビゲーションロールが設定されていること', () => {
        render(<Header />);

        const nav = screen.getByRole('navigation');
        expect(nav).toHaveAttribute('aria-label', 'メインナビゲーション');
      });
    });

    context('フィードページにいる場合', () => {
      it('フィードリンクがアクティブであること', async () => {
        const { usePathname } = await import('next/navigation');
        vi.mocked(usePathname).mockReturnValue('/');

        render(<Header />);

        const feedLink = screen.getByTestId('nav-link-feed');
        expect(feedLink).toHaveAttribute('aria-current', 'page');
      });

      it('ダッシュボードリンクがアクティブでないこと', async () => {
        const { usePathname } = await import('next/navigation');
        vi.mocked(usePathname).mockReturnValue('/');

        render(<Header />);

        const dashboardLink = screen.getByTestId('nav-link-dashboard');
        expect(dashboardLink).not.toHaveAttribute('aria-current');
      });
    });

    context('ダッシュボードページにいる場合', () => {
      it('ダッシュボードリンクがアクティブであること', async () => {
        const { usePathname } = await import('next/navigation');
        vi.mocked(usePathname).mockReturnValue('/dashboard');

        render(<Header />);

        const dashboardLink = screen.getByTestId('nav-link-dashboard');
        expect(dashboardLink).toHaveAttribute('aria-current', 'page');
      });

      it('フィードリンクがアクティブでないこと', async () => {
        const { usePathname } = await import('next/navigation');
        vi.mocked(usePathname).mockReturnValue('/dashboard');

        render(<Header />);

        const feedLink = screen.getByTestId('nav-link-feed');
        expect(feedLink).not.toHaveAttribute('aria-current');
      });
    });
  });

  describe('ロゴ', () => {
    context('ロゴをクリックする場合', () => {
      it('トップページへのリンクであること', () => {
        render(<Header />);

        const logoLink = screen.getByRole('link', { name: /Tech Feed/i });
        expect(logoLink).toHaveAttribute('href', '/');
      });
    });
  });
});
