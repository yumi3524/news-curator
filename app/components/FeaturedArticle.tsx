import { Heart, Bookmark, Calendar, Sparkles } from 'lucide-react';
import { useState, useEffect } from 'react';
import type { Article } from '@/app/types/types';
import { formatDate } from '../lib/utils';
import { useTagClickHandler } from '../lib/hooks/useTagClickHandler';

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
              <button
                key={tag}
                onClick={(e) => handleTagClick(e, tag)}
                className="whitespace-nowrap rounded-md bg-white/10 px-3.5 py-1.5 text-[13px] font-semibold text-[var(--color-featured-text)] backdrop-blur-[10px] transition-all hover:bg-white/20 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-white/50 focus:ring-offset-1"
                aria-label={`${tag}でフィルタリング`}
                type="button"
              >
                {tag}
              </button>
            ))}
            {article.tags.length > 5 && (
              <span className="whitespace-nowrap rounded-md bg-white/10 px-3.5 py-1.5 text-[13px] font-semibold text-[var(--color-featured-text)] backdrop-blur-[10px]">
                +{article.tags.length - 5}
              </span>
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
          <div className="flex gap-6 text-sm text-[var(--color-featured-text)]/85">
            {article.likesCount !== undefined && (
              <div className="flex items-center gap-2">
                <Heart className="h-4 w-4" />
                <span>{article.likesCount}</span>
              </div>
            )}
            {article.stocksCount !== undefined && (
              <div className="flex items-center gap-2">
                <Bookmark className="h-4 w-4" />
                <span>{article.stocksCount}</span>
              </div>
            )}
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <span>{mounted ? formatDate(article.publishedAt) : '—'}</span>
            </div>
          </div>
        </div>
      </a>
    </section>
  );
}
