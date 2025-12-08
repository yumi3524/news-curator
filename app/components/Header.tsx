'use client';

import { RefreshCw } from 'lucide-react';
import { useState, useEffect } from 'react';

interface HeaderProps {
  lastUpdated: string;
  onRefresh: () => void;
  isLoading?: boolean;
}

export function Header({ lastUpdated, onRefresh, isLoading = false }: HeaderProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <header className="sticky top-0 z-[100] border-b-2 border-[var(--color-brand-primary)] bg-[var(--color-bg-secondary)] px-8 py-6 shadow-[0_1px_3px_rgba(0,0,0,0.05)] transition-all duration-300 animate-[slideDown_0.4s_ease-out]">
      <div className="mx-auto flex max-w-[1400px] items-center justify-between gap-8">
        <div>
          <h1 className="font-[Sora,sans-serif] text-[1.75rem] font-bold leading-tight tracking-tight text-[var(--color-text-primary)] transition-colors duration-300">
            News <span className="text-[var(--color-brand-primary)] transition-colors duration-300">Curator</span>
          </h1>
          <p className="mt-1 text-sm font-medium text-[var(--color-text-secondary)]">
            毎朝3分でキャッチアップできる技術ニュースダッシュボード
          </p>
        </div>

        <div className="flex items-center gap-6">
          <div className="text-right">
            <span className="block text-xs font-semibold uppercase tracking-wider text-[var(--color-text-tertiary)]">
              最終更新
            </span>
            <span className="mt-0.5 block text-sm font-semibold text-[var(--color-text-secondary)]">
              {mounted ? lastUpdated : '—'}
            </span>
          </div>

          <button
            onClick={onRefresh}
            disabled={isLoading}
            className="flex items-center gap-2 rounded-lg bg-[var(--color-brand-primary)] px-6 py-3 text-sm font-semibold text-white shadow-[0_2px_8px_rgba(0,0,0,0.1)] transition-all duration-200 hover:-translate-y-0.5 hover:bg-[var(--color-accent-dark)] hover:shadow-[0_4px_12px_rgba(0,0,0,0.15)] disabled:cursor-not-allowed disabled:opacity-50"
          >
            <RefreshCw className={`h-4 w-4 transition-transform duration-600 ${isLoading ? 'animate-spin' : ''}`} />
            <span>更新</span>
          </button>
        </div>
      </div>
    </header>
  );
}
