'use client';

import { Sun, Moon } from 'lucide-react';
import { useEffect, useState } from 'react';

export function ThemeSwitcher() {
  const [isDark, setIsDark] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
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
      aria-label={isDark ? 'ライトモードに切り替え' : 'ダークモードに切り替え'}
      className="flex items-center justify-center rounded-xl border-[1.5px] border-[var(--color-border)] bg-[var(--color-bg-secondary)] p-2.5 shadow-[0_2px_8px_rgba(0,0,0,0.1)] transition-all duration-200 hover:-translate-y-0.5 hover:border-[var(--color-brand-primary)] hover:shadow-[0_4px_12px_rgba(0,0,0,0.15)] md:p-3"
    >
      {isDark ? (
        <Moon className="h-4 w-4 text-[var(--color-brand-primary)] md:h-5 md:w-5" />
      ) : (
        <Sun className="h-4 w-4 text-[var(--color-brand-primary)] md:h-5 md:w-5" />
      )}
    </button>
  );
}
