import { Flame } from "lucide-react";

/** StreakBadgeのProps */
interface StreakBadgeProps {
  /** 連続日数 */
  days: number;
  /** サイズ */
  size?: "sm" | "md" | "lg";
  /** 最長記録かどうか */
  isRecord?: boolean;
}

/** サイズごとのスタイル */
const SIZE_STYLES = {
  sm: {
    padding: "px-2 py-1",
    text: "text-[11px]",
    icon: "w-3 h-3",
    gap: "gap-1",
  },
  md: {
    padding: "px-3 py-1.5",
    text: "text-[13px]",
    icon: "w-4 h-4",
    gap: "gap-1.5",
  },
  lg: {
    padding: "px-4 py-2",
    text: "text-[15px]",
    icon: "w-5 h-5",
    gap: "gap-2",
  },
};

/**
 * ストリークバッジコンポーネント
 *
 * 連続日数の達成状況を表示します。
 */
export function StreakBadge({
  days,
  size = "md",
  isRecord = false,
}: StreakBadgeProps) {
  const styles = SIZE_STYLES[size];

  // 連続日数に応じた色の強度
  const intensity = Math.min(1, days / 30); // 30日で最大強度
  const baseOpacity = 0.1 + intensity * 0.15;

  return (
    <div
      className={`
        inline-flex items-center ${styles.gap} ${styles.padding}
        rounded-full font-semibold ${styles.text}
        transition-all duration-300
      `}
      style={{
        background: isRecord
          ? `rgba(232, 169, 84, ${baseOpacity + 0.1})`
          : `rgba(232, 139, 90, ${baseOpacity})`,
        color: isRecord
          ? "var(--color-accent-primary)"
          : "var(--color-hackernews)",
        border: isRecord
          ? "1px solid rgba(232, 169, 84, 0.3)"
          : "1px solid rgba(232, 139, 90, 0.2)",
      }}
      data-testid="streak-badge"
    >
      <Flame
        className={`${styles.icon} ${isRecord ? "animate-pulse" : ""}`}
        aria-hidden="true"
        data-testid="streak-badge-icon"
      />
      <span data-testid="streak-badge-days">{days}日連続</span>
      {isRecord && (
        <span
          className="text-[9px] uppercase tracking-wider font-bold ml-1"
          data-testid="streak-badge-record"
        >
          最長
        </span>
      )}
    </div>
  );
}
