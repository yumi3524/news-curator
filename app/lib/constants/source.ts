import type { Source } from '@/app/types/types';

/** ソース表示名 */
export const SOURCE_DISPLAY_NAMES: Record<Source, string> = {
  qiita: 'Qiita',
  hackernews: 'HN',
  github: 'GitHub',
};

/** CSS変数を使用したソースカラー（style属性用） */
export const SOURCE_COLOR_VARS: Record<Source, string> = {
  qiita: 'var(--color-qiita)',
  hackernews: 'var(--color-hackernews)',
  github: 'var(--color-github)',
};

/** Tailwindクラス用のソースカラー */
export const SOURCE_COLOR_CLASSES: Record<Source, string> = {
  qiita: 'text-[var(--color-qiita)]',
  hackernews: 'text-[var(--color-hackernews)]',
  github: 'text-[var(--color-github)]',
};

/** トレンド方向のカラークラス */
export type TrendDirection = 'up' | 'down' | 'neutral';

export const TREND_COLOR_CLASSES: Record<TrendDirection, string> = {
  up: 'text-[var(--color-success)]',
  down: 'text-[var(--color-error)]',
  neutral: 'text-[var(--color-text-tertiary)]',
};
