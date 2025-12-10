import { Heart, Bookmark } from 'lucide-react';
import type { Article } from '@/app/types/types';
import { MAX_TAGS_TO_DISPLAY_MOBILE } from '@/app/lib/constants';
import { useTagClickHandler } from '../lib/hooks/useTagClickHandler';
import { Tag } from './Tag';
import { Badge } from './Badge';

interface ArticleCardProps {
  article: Article;
  onTagClick?: (tag: string) => void;
}

export function ArticleCard({ article, onTagClick }: ArticleCardProps) {
  const handleTagClick = useTagClickHandler(onTagClick);

  // モバイル用: 最大5個のタグを表示
  const visibleTags = article.tags.slice(0, MAX_TAGS_TO_DISPLAY_MOBILE);
  const remainingCount = article.tags.length - MAX_TAGS_TO_DISPLAY_MOBILE;

  return (
    <a
      href={article.url}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex h-full flex-col rounded-[10px] border-[1.5px] border-[var(--color-border)] bg-[var(--color-bg-secondary)] p-6 shadow-[0_1px_3px_rgba(0,0,0,0.05)] transition-all duration-300 hover:-translate-y-1 hover:border-[var(--color-brand-primary)] hover:shadow-[0_6px_20px_rgba(0,0,0,0.08)]"
      data-testid="article-card"
    >
      {/* Tags - モバイル: 横スクロール, デスクトップ: 折り返し */}
      <div className="mb-3.5 flex min-h-[28px] gap-1.5 overflow-x-auto flex-nowrap md:flex-wrap md:overflow-x-visible scrollbar-hide">
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

      {/* Title */}
      <h3 className="mb-3 min-h-[3.15rem] line-clamp-2 text-lg font-bold leading-[1.4] text-[var(--color-text-primary)]">
        {article.title}
      </h3>

      {/* Summary */}
      <p className="mb-4 flex-grow line-clamp-2 text-sm leading-[1.6] text-[var(--color-text-secondary)]">
        {article.description}
      </p>

      {/* Footer */}
      <div className="mt-auto flex items-center justify-between border-t border-[var(--color-border)] pt-4">
        <div className="flex gap-4">
          {article.likesCount !== undefined && (
            <Badge icon={<Heart className="h-3.5 w-3.5" />} label={article.likesCount} />
          )}
          {article.stocksCount !== undefined && (
            <Badge icon={<Bookmark className="h-3.5 w-3.5" />} label={article.stocksCount} />
          )}
        </div>

        <div className="text-xs font-semibold uppercase tracking-wide text-[var(--color-brand-primary)]">
          {article.source.name}
        </div>
      </div>
    </a>
  );
}
