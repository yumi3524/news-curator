'use client';

import { Sun, Moon } from 'lucide-react';
import { useEffect, useState } from 'react';

export function ThemeSwitcher() {
  const [isDark, setIsDark] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    // ユーザーの保存された設定を確認
    const savedMode = localStorage.getItem('darkMode');

    let darkMode: boolean;
    if (savedMode !== null) {
      // 保存された設定がある場合はそれを使用
      darkMode = savedMode === 'true';
    } else {
      // 保存された設定がない場合はシステム設定を使用
      darkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
    }

    setIsDark(darkMode);
    document.documentElement.classList.toggle('dark', darkMode);
  }, []);

  const toggleTheme = () => {
    const newMode = !isDark;
    setIsDark(newMode);
    document.documentElement.classList.toggle('dark', newMode);
    localStorage.setItem('darkMode', String(newMode));
  };

  if (!mounted) {
    return null;
  }

  return (
    <button
      onClick={toggleTheme}
      className="fixed top-5 right-5 z-[1000] flex items-center gap-2 rounded-xl border-[1.5px] border-[var(--color-border)] bg-[var(--color-bg-secondary)] px-5 py-3 shadow-[0_2px_8px_rgba(0,0,0,0.1)] transition-all duration-200 hover:-translate-y-0.5 hover:border-[var(--color-brand-primary)] hover:shadow-[0_4px_12px_rgba(0,0,0,0.15)]"
    >
      {isDark ? (
        <Moon className="h-[18px] w-[18px] text-[var(--color-brand-primary)]" />
      ) : (
        <Sun className="h-[18px] w-[18px] text-[var(--color-brand-primary)]" />
      )}
      <span className="text-sm font-semibold text-[var(--color-text-primary)]">
        {isDark ? 'ダークモード' : 'ライトモード'}
      </span>
    </button>
  );
}
