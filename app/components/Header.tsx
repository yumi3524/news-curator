'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Newspaper, LayoutDashboard } from 'lucide-react';
import { ThemeSwitcher } from './ThemeSwitcher';
import { CategoryBadge } from './CategoryBadge';
import type { CategoryId } from '@/app/types/types';

/** ナビゲーションリンク */
const navLinks = [
  { href: '/', label: 'フィード', icon: Newspaper },
  { href: '/dashboard', label: 'ダッシュボード', icon: LayoutDashboard },
];

interface HeaderProps {
  selectedCategories?: CategoryId[];
  onCategoryClick?: () => void;
}

export function Header({ selectedCategories = [], onCategoryClick }: HeaderProps) {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-[100] border-b border-[var(--color-border)] bg-[var(--color-bg-elevated)] px-4 py-3 shadow-[0_1px_3px_rgba(0,0,0,0.1)] transition-all duration-300 animate-[slideDown_0.4s_ease-out] md:px-8 md:py-4">
      <div className="mx-auto flex max-w-[1400px] items-center justify-between gap-4">
        {/* ロゴ */}
        <Link href="/" className="flex-shrink-0 group">
          <h1 className="font-[Sora,sans-serif] text-xl font-bold leading-tight tracking-tight text-[var(--color-text-primary)] transition-colors duration-300 md:text-2xl">
            Tech <span className="text-[var(--color-accent-primary)] transition-colors duration-300 group-hover:text-[var(--color-accent-secondary)]">Feed</span>
          </h1>
        </Link>

        {/* 右側: ナビゲーション + テーマ切り替え */}
        <div className="flex items-center gap-2">
          <nav className="flex items-center gap-1" role="navigation" aria-label="メインナビゲーション">
            {navLinks.map(({ href, label, icon: Icon }) => {
              const isActive = pathname === href;
              return (
                <Link
                  key={href}
                  href={href}
                  className={`
                    flex items-center justify-center w-9 h-9 rounded-[10px]
                    transition-all duration-200
                    ${isActive
                      ? 'bg-[var(--color-accent-subtle)] text-[var(--color-accent-primary)]'
                      : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-white/[0.05]'
                    }
                  `}
                  aria-current={isActive ? 'page' : undefined}
                  aria-label={label}
                  title={label}
                  data-testid={`nav-link-${href === '/' ? 'feed' : 'dashboard'}`}
                >
                  <Icon className="w-[18px] h-[18px]" aria-hidden="true" />
                </Link>
              );
            })}
          </nav>
          {onCategoryClick && (
            <CategoryBadge
              selectedCategories={selectedCategories}
              onClick={onCategoryClick}
            />
          )}
          <ThemeSwitcher />
        </div>
      </div>
    </header>
  );
}
