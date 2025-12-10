'use client';

import { ThemeSwitcher } from './ThemeSwitcher';

export function Header() {
  return (
    <header className="sticky top-0 z-[100] border-b-2 border-[var(--color-brand-primary)] bg-[var(--color-bg-secondary)] px-4 py-4 shadow-[0_1px_3px_rgba(0,0,0,0.05)] transition-all duration-300 animate-[slideDown_0.4s_ease-out] md:px-8 md:py-6">
      <div className="mx-auto flex max-w-[1400px] items-start justify-between gap-4 md:items-center">
        <div className="flex-1">
          <h1 className="font-[Sora,sans-serif] text-2xl font-bold leading-tight tracking-tight text-[var(--color-text-primary)] transition-colors duration-300 md:text-[1.75rem]">
            Tech <span className="text-[var(--color-brand-primary)] transition-colors duration-300">Feed</span>
          </h1>
          <div className="mt-1 flex items-center gap-2">
            {/* Simple badge - mobile only */}
            <span className="inline-block rounded-md bg-[var(--color-brand-primary)] px-2 py-0.5 text-[11px] font-bold text-[var(--color-text-on-accent)] shadow-sm md:hidden">
              毎朝3分!
            </span>
            <p className="text-sm font-medium text-[var(--color-text-secondary)]">
              <span className="md:hidden">日々の技術情報フィード</span>
              <span className="hidden md:inline">毎朝3分でキャッチアップできる技術情報フィード</span>
            </p>
          </div>
        </div>
        <div className="flex-shrink-0">
          <ThemeSwitcher />
        </div>
      </div>
    </header>
  );
}
