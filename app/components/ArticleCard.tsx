import { Heart, Bookmark } from 'lucide-react';
import type { Article } from '@/app/types/types';

import { MAX_TAGS_TO_DISPLAY } from '@/app/lib/constants';

interface ArticleCardProps {
  article: Article;
}

export function ArticleCard({ article }: ArticleCardProps) {
  return (
    <a
      href={article.url}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex h-full flex-col rounded-[10px] border-[1.5px] border-[var(--color-border)] bg-[var(--color-bg-secondary)] p-6 shadow-[0_1px_3px_rgba(0,0,0,0.05)] transition-all duration-300 hover:-translate-y-1 hover:border-[var(--color-brand-primary)] hover:shadow-[0_6px_20px_rgba(0,0,0,0.08)]"
    >
      {/* Tags */}
      <div className="mb-3.5 flex min-h-[28px] flex-wrap gap-1.5">
        {article.tags.slice(0, MAX_TAGS_TO_DISPLAY).map((tag) => (
          <span
            key={tag}
            className="whitespace-nowrap rounded bg-[var(--color-bg-tertiary)] px-2.5 py-1 text-xs font-semibold text-[var(--color-text-secondary)]"
          >
            {tag}
          </span>
        ))}
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
        <div className="flex gap-4 text-[13px] text-[var(--color-text-tertiary)]">
          {article.likesCount !== undefined && (
            <div className="flex items-center gap-1.5">
              <Heart className="h-3.5 w-3.5" />
              <span>{article.likesCount}</span>
            </div>
          )}
          {article.stocksCount !== undefined && (
            <div className="flex items-center gap-1.5">
              <Bookmark className="h-3.5 w-3.5" />
              <span>{article.stocksCount}</span>
            </div>
          )}
        </div>

        <div className="text-xs font-semibold uppercase tracking-wide text-[var(--color-brand-primary)]">
          {article.source.name}
        </div>
      </div>
    </a>
  );
}
