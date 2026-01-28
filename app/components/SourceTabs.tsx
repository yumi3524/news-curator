"use client";

import type { Source } from "@/app/types/types";
import { SOURCE_COLOR_CLASSES } from "../lib/constants/source";

/** タブ情報 */
interface TabItem {
  id: Source | "all";
  label: string;
  count?: number;
}

/** SourceTabsのProps */
interface SourceTabsProps {
  /** 現在選択中のタブ */
  activeTab: Source | "all";
  /** タブ変更時のコールバック */
  onTabChange: (tab: Source | "all") => void;
  /** 各ソースの記事数（オプション） */
  counts?: {
    all?: number;
    qiita?: number;
    hackernews?: number;
  };
}

/**
 * ソース切り替えタブコンポーネント
 *
 * Qiita、Hacker Newsのソース別表示を切り替えます。
 */
export function SourceTabs({
  activeTab,
  onTabChange,
  counts,
}: SourceTabsProps) {
  const tabs: TabItem[] = [
    { id: "all", label: "すべて", count: counts?.all },
    { id: "qiita", label: "Qiita", count: counts?.qiita },
    { id: "hackernews", label: "HN", count: counts?.hackernews },
  ];

  return (
    <nav
      className="flex gap-1 p-1 rounded-[14px] border"
      style={{
        background: "var(--color-bg-elevated)",
        borderColor: "var(--color-border)",
      }}
      role="tablist"
      aria-label="ソース切り替え"
    >
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        const isSource = tab.id !== "all";
        const sourceColor = isSource ? SOURCE_COLOR_CLASSES[tab.id as Source] : "";

        return (
          <button
            key={tab.id}
            role="tab"
            aria-selected={isActive}
            aria-controls={`tabpanel-${tab.id}`}
            onClick={() => onTabChange(tab.id)}
            className={`
              flex items-center gap-2 px-4 py-2 text-[13px] font-medium
              rounded-[10px] border-none cursor-pointer
              transition-all duration-[0.25s] ease-out
              ${
                isActive
                  ? `shadow-sm ${isSource ? sourceColor : ""}`
                  : "hover:bg-white/[0.02]"
              }
            `}
            style={{
              background: isActive ? "var(--color-bg-card)" : "transparent",
              color: isActive
                ? isSource
                  ? undefined
                  : "var(--color-text-primary)"
                : "var(--color-text-tertiary)",
            }}
          >
            <span>{tab.label}</span>
            {tab.count !== undefined && (
              <span
                className={`
                  min-w-5 h-5 px-1.5 text-[11px] font-bold
                  rounded-full flex items-center justify-center
                `}
                style={{
                  background: isActive
                    ? "var(--color-accent-primary)"
                    : "var(--color-bg-card)",
                  color: isActive
                    ? "var(--color-text-inverse)"
                    : "var(--color-text-tertiary)",
                }}
              >
                {tab.count}
              </span>
            )}
          </button>
        );
      })}
    </nav>
  );
}
