import { TrendingUp, TrendingDown } from "lucide-react";
import { TREND_COLOR_CLASSES, type TrendDirection } from "../lib/constants/source";

/** StatCardのProps */
interface StatCardProps {
  /** ラベル（例: "今週読んだ記事"） */
  label: string;
  /** 値（例: 42） */
  value: number | string;
  /** トレンド値（例: "+12%"） */
  trend?: string;
  /** トレンド方向 */
  trendDirection?: TrendDirection;
  /** アイコン（オプション） */
  icon?: React.ReactNode;
}

/**
 * 統計カードコンポーネント
 *
 * ダッシュボードなどで統計情報を表示します。
 */
export function StatCard({
  label,
  value,
  trend,
  trendDirection = "neutral",
  icon,
}: StatCardProps) {
  const trendColorClass = TREND_COLOR_CLASSES[trendDirection];

  return (
    <div
      className="p-5 rounded-[14px] border"
      style={{
        background: "var(--color-bg-card)",
        borderColor: "var(--color-border)",
      }}
      data-testid="stat-card"
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          {/* ラベル */}
          <p
            className="text-[11px] font-medium uppercase tracking-[0.08em] mb-2"
            style={{ color: "var(--color-text-tertiary)" }}
            data-testid="stat-card-label"
          >
            {label}
          </p>

          {/* 値 */}
          <p
            className="text-[32px] font-bold tracking-[-0.02em]"
            style={{ color: "var(--color-text-primary)" }}
            data-testid="stat-card-value"
          >
            {value}
          </p>

          {/* トレンド */}
          {trend && (
            <div
              className={`flex items-center gap-1 text-[11px] font-semibold mt-2 ${trendColorClass}`}
              data-testid="stat-card-trend"
            >
              {trendDirection === "up" && (
                <TrendingUp className="w-3.5 h-3.5" aria-hidden="true" />
              )}
              {trendDirection === "down" && (
                <TrendingDown className="w-3.5 h-3.5" aria-hidden="true" />
              )}
              <span>{trend}</span>
            </div>
          )}
        </div>

        {/* アイコン */}
        {icon && (
          <div
            className="w-10 h-10 rounded-[10px] flex items-center justify-center"
            style={{
              background: "var(--color-accent-subtle)",
              color: "var(--color-accent-primary)",
            }}
            data-testid="stat-card-icon"
          >
            {icon}
          </div>
        )}
      </div>
    </div>
  );
}
