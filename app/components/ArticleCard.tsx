'use client';

import { useState } from 'react';
import { Heart, Bookmark, Clock, MessageCircle, Star, Languages } from 'lucide-react';
import type { Article } from '../types/types';
import { MAX_TAGS_TO_DISPLAY_MOBILE } from '../lib/constants';
import { SOURCE_DISPLAY_NAMES, SOURCE_COLOR_VARS } from '../lib/constants/source';
import { useTagClickHandler } from '../lib/hooks/useTagClickHandler';
import { Tag } from './Tag';
import { Badge } from './Badge';

/** 翻訳切り替えボタンのスタイル定数 */
const TRANSLATION_STYLES = {
  active: {
    background: 'rgba(232, 139, 90, 0.15)',
    color: 'var(--color-hackernews)',
    border: '1px solid rgba(232, 139, 90, 0.25)',
  },
  inactive: {
    background: 'rgba(100, 100, 100, 0.15)',
    color: 'var(--color-text-tertiary)',
    border: '1px solid rgba(100, 100, 100, 0.25)',
  },
} as const;

interface TranslationToggleButtonProps {
  showTranslated: boolean;
  onToggle: () => void;
}

function TranslationToggleButton({ showTranslated, onToggle }: TranslationToggleButtonProps): React.ReactElement {
  const styles = showTranslated ? TRANSLATION_STYLES.active : TRANSLATION_STYLES.inactive;

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onToggle();
  };

  return (
    <button
      onClick={handleClick}
      className="flex items-center gap-1 px-2 py-0.5 text-[10px] font-semibold rounded-[6px] transition-colors hover:opacity-80"
      style={styles}
      aria-label={showTranslated ? '原文を表示' : '翻訳を表示'}
      data-testid="translation-toggle"
    >
      <Languages className="w-2.5 h-2.5" />
      {showTranslated ? '翻訳' : '原文'}
    </button>
  );
}

interface ArticleCardProps {
  article: Article;
  onTagClick?: (tag: string) => void;
  /** お気に入り切り替えハンドラ（オプション：指定時のみお気に入りボタン表示） */
  onToggleFavorite?: (articleId: string) => void;
  /** 翻訳表示の初期状態（デフォルト: true = 翻訳表示） */
  showTranslatedDefault?: boolean;
}

export function ArticleCard({
  article,
  onTagClick,
  onToggleFavorite,
  showTranslatedDefault = true,
}: ArticleCardProps) {
  const handleTagClick = useTagClickHandler(onTagClick);
  const sourceColor = SOURCE_COLOR_VARS[article.source];

  // 翻訳表示の切り替え状態
  const [showTranslated, setShowTranslated] = useState(showTranslatedDefault);

  // 表示するタイトル・説明を決定
  const displayTitle = showTranslated && article.titleJa ? article.titleJa : article.title;
  const displayDescription = showTranslated && article.descriptionJa ? article.descriptionJa : article.description;

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onToggleFavorite?.(article.id);
  };

  // モバイル用: 最大5個のタグを表示
  const visibleTags = article.tags.slice(0, MAX_TAGS_TO_DISPLAY_MOBILE);
  const remainingCount = article.tags.length - MAX_TAGS_TO_DISPLAY_MOBILE;

  // ソース別のメトリクス表示
  const renderMetrics = () => {
    switch (article.source) {
      case 'qiita':
        return (
          <>
            {article.likesCount !== undefined && (
              <Badge icon={<Heart className="h-3.5 w-3.5" />} label={article.likesCount} />
            )}
            {article.stocksCount !== undefined && (
              <Badge icon={<Bookmark className="h-3.5 w-3.5" />} label={article.stocksCount} />
            )}
          </>
        );
      case 'hackernews':
        return (
          <>
            {article.score !== undefined && (
              <Badge icon={<Star className="h-3.5 w-3.5" />} label={article.score} />
            )}
            {article.commentsCount !== undefined && (
              <Badge icon={<MessageCircle className="h-3.5 w-3.5" />} label={article.commentsCount} />
            )}
          </>
        );
      default:
        return null;
    }
  };

  return (
    <div className="group relative">
      <a
        href={article.url}
        target="_blank"
        rel="noopener noreferrer"
        className="relative flex h-full flex-col overflow-hidden rounded-[14px] border border-[var(--color-border)] bg-[var(--color-bg-card)] p-6 transition-all duration-[350ms] ease-[cubic-bezier(0.4,0,0.2,1)] hover:-translate-y-0.5 hover:border-[var(--color-border-hover)] hover:bg-[var(--color-bg-card-hover)]"
        data-testid="article-card"
        data-source={article.source}
      >
        {/* ソースカラーの左アクセントバー */}
        <div
          className="absolute left-0 top-6 bottom-6 w-[3px] rounded-r-sm opacity-60 transition-opacity duration-[250ms] group-hover:opacity-100"
          style={{ background: sourceColor }}
          aria-hidden="true"
        />

        {/* グロー効果（ホバー時） */}
        <div
          className="pointer-events-none absolute inset-0 rounded-[14px] opacity-0 transition-opacity duration-[350ms] group-hover:opacity-100"
          style={{
            background: `radial-gradient(ellipse 100% 100% at 50% 0%, ${sourceColor}15, transparent 70%)`,
          }}
          aria-hidden="true"
        />

        {/* Header: Tags + Reading time / Favorite */}
        <div className="mb-4 flex items-start justify-between gap-3">
          {/* Tags */}
          <div
            className="flex min-h-[24px] flex-wrap gap-2"
            data-testid="article-tags"
          >
            {visibleTags.map((tag) => (
              <Tag
                key={tag}
                label={tag}
                variant="default"
                size="sm"
                onClick={(e) => handleTagClick(e, tag)}
                aria-label={`${tag}でフィルタリング`}
              />
            ))}
            {remainingCount > 0 && (
              <Tag
                label={`+${remainingCount}`}
                variant="default"
                size="sm"
                isClickable={false}
              />
            )}
          </div>

          {/* Reading time + Translated badge + Favorite button */}
          <div className="flex items-center gap-2 shrink-0">
            {article.isTranslated && (
              <TranslationToggleButton
                showTranslated={showTranslated}
                onToggle={() => setShowTranslated((prev) => !prev)}
              />
            )}
            {article.readingTimeMinutes && (
              <span
                className="flex items-center gap-1 text-[11px] font-medium whitespace-nowrap"
                style={{ color: 'var(--color-text-tertiary)' }}
                data-testid="reading-time"
              >
                <Clock className="w-3 h-3 opacity-70" />
                {article.readingTimeMinutes}分
              </span>
            )}
            {/* お気に入りボタン（onToggleFavorite が渡された場合のみ表示） */}
            {onToggleFavorite && (
              <button
                onClick={handleFavoriteClick}
                className="flex h-7 w-7 items-center justify-center rounded-full transition-all duration-200 hover:scale-110 hover:bg-white/5"
                aria-label={article.isFavorite ? 'お気に入りから削除' : 'お気に入りに追加'}
                data-testid="favorite-button"
              >
                <Heart
                  className={`h-4 w-4 transition-colors ${
                    article.isFavorite
                      ? 'fill-red-500 text-red-500'
                      : 'text-[var(--color-text-tertiary)] hover:text-[var(--color-text-secondary)]'
                  }`}
                />
              </button>
            )}
          </div>
        </div>

        {/* Title */}
        <h3
          className="mb-3 line-clamp-2 text-[17px] font-semibold leading-[1.45] tracking-[-0.01em] transition-colors duration-150 group-hover:text-[var(--color-accent-primary)]"
          style={{ color: 'var(--color-text-primary)' }}
          data-testid="article-title"
        >
          {displayTitle}
        </h3>

        {/* Description */}
        <p
          className="mb-5 flex-grow line-clamp-2 text-[13px] leading-[1.65]"
          style={{ color: 'var(--color-text-secondary)' }}
        >
          {displayDescription}
        </p>

        {/* Footer */}
        <div
          className="mt-auto flex items-center justify-between border-t pt-4"
          style={{ borderColor: 'var(--color-border)' }}
          data-testid="article-meta"
        >
          <div className="flex gap-4">
            {renderMetrics()}
          </div>

          <span
            className="text-[10px] font-bold uppercase tracking-[0.1em] opacity-90"
            style={{ color: sourceColor }}
            data-testid="source-badge"
          >
            {SOURCE_DISPLAY_NAMES[article.source]}
          </span>
        </div>
      </a>
    </div>
  );
}

// default exportも追加（互換性のため）
export default ArticleCard;
