import { Heart, Bookmark, Calendar, Sparkles } from 'lucide-react';
import { useState, useEffect } from 'react';
import type { Article } from '@/app/types/types';
import { formatDate } from '../lib/utils';
import { useTagClickHandler } from '../lib/hooks/useTagClickHandler';
import { Tag } from './Tag';
import { Badge } from './Badge';

interface FeaturedArticleProps {
  article: Article;
  onTagClick?: (tag: string) => void;
}

export function FeaturedArticle({ article, onTagClick }: FeaturedArticleProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  const handleTagClick = useTagClickHandler(onTagClick);

  return (
    <section className="mb-3 animate-[fadeIn_0.5s_ease-out_0.2s_both] md:mb-4">
      <div className="mb-2 flex items-center gap-2 text-sm font-bold uppercase tracking-wide text-[var(--color-brand-primary)]">
        <Sparkles className="h-4 w-4" />
        <span>PICK UP!</span>
      </div>

      <a
        href={article.url}
        target="_blank"
        rel="noopener noreferrer"
        className="group relative block cursor-pointer overflow-hidden rounded-xl border-l-4 border-[var(--color-brand-primary)] bg-[var(--color-featured-bg-start)] p-4 shadow-[0_4px_20px_rgba(0,0,0,0.08)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_8px_30px_rgba(0,0,0,0.12)] md:p-4 lg:p-6 xl:p-8"
      >

        <div className="relative z-10">
          {/* Tags - モバイル: 横スクロール, デスクトップ: 折り返し */}
          <div className="mb-2 flex gap-2 overflow-x-auto flex-nowrap md:flex-wrap md:overflow-x-visible scrollbar-hide">
            {article.tags.slice(0, 5).map((tag) => (
              <Tag
                key={tag}
                label={tag}
                variant="featured"
                size="sm"
                onClick={(e) => handleTagClick(e, tag)}
                aria-label={`${tag}でフィルタリング`}
              />
            ))}
            {article.tags.length > 5 && (
              <Tag
                label={`+${article.tags.length - 5}`}
                variant="featured"
                size="sm"
                isClickable={false}
              />
            )}
          </div>

          {/* Title */}
          <h2 className="mb-2 line-clamp-2 font-[Sora,sans-serif] text-lg font-bold leading-[1.3] text-[var(--color-featured-text)] md:text-lg lg:text-xl xl:text-2xl">
            {article.title}
          </h2>

          {/* Summary */}
          <p className="mb-2 line-clamp-1 text-sm leading-[1.6] text-[var(--color-featured-text)]/90 md:mb-3 md:line-clamp-1 lg:line-clamp-2">
            {article.description}
          </p>

          {/* Meta */}
          <div className="flex gap-6">
            {article.likesCount !== undefined && (
              <Badge icon={<Heart className="h-4 w-4" />} label={article.likesCount} variant="muted" size="md" />
            )}
            {article.stocksCount !== undefined && (
              <Badge icon={<Bookmark className="h-4 w-4" />} label={article.stocksCount} variant="muted" size="md" />
            )}
            <Badge
              icon={<Calendar className="h-4 w-4" />}
              label={mounted ? formatDate(article.publishedAt) : '—'}
              variant="muted"
              size="md"
            />
          </div>
        </div>
      </a>
    </section>
  );
}
