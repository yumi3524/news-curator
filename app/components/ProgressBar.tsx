/** ProgressBarのProps */
interface ProgressBarProps {
  /** 進捗値（0-100） */
  value: number;
  /** 最大値（デフォルト: 100） */
  max?: number;
  /** ラベル（オプション） */
  label?: string;
  /** サブラベル（オプション、例: "15/20記事"） */
  subLabel?: string;
  /** サイズ */
  size?: "sm" | "md" | "lg";
  /** カラーバリアント */
  variant?: "default" | "success" | "warning" | "accent";
}

/** サイズごとの高さ */
const SIZE_HEIGHT: Record<string, string> = {
  sm: "h-1.5",
  md: "h-2",
  lg: "h-3",
};

/** バリアントごとの色 */
const VARIANT_COLORS: Record<string, string> = {
  default: "var(--color-info)",
  success: "var(--color-success)",
  warning: "var(--color-warning)",
  accent: "var(--color-accent-primary)",
};

/**
 * プログレスバーコンポーネント
 *
 * 進捗状況を視覚的に表示します。
 */
export function ProgressBar({
  value,
  max = 100,
  label,
  subLabel,
  size = "md",
  variant = "accent",
}: ProgressBarProps) {
  // 0-100の範囲にクランプ
  const percentage = Math.min(100, Math.max(0, (value / max) * 100));

  return (
    <div className="w-full" data-testid="progress-bar">
      {/* ラベル行 */}
      {(label || subLabel) && (
        <div className="flex items-center justify-between mb-2">
          {label && (
            <span
              className="text-[13px] font-medium"
              style={{ color: "var(--color-text-secondary)" }}
              data-testid="progress-bar-label"
            >
              {label}
            </span>
          )}
          {subLabel && (
            <span
              className="text-[11px] font-medium"
              style={{ color: "var(--color-text-tertiary)" }}
              data-testid="progress-bar-sublabel"
            >
              {subLabel}
            </span>
          )}
        </div>
      )}

      {/* バー */}
      <div
        className={`w-full rounded-full overflow-hidden ${SIZE_HEIGHT[size]}`}
        style={{ background: "var(--color-bg-input)" }}
        role="progressbar"
        aria-valuenow={value}
        aria-valuemin={0}
        aria-valuemax={max}
        aria-label={label}
      >
        <div
          className={`${SIZE_HEIGHT[size]} rounded-full transition-all duration-300 ease-out`}
          style={{
            width: `${percentage}%`,
            background: VARIANT_COLORS[variant],
          }}
          data-testid="progress-bar-fill"
        />
      </div>
    </div>
  );
}
