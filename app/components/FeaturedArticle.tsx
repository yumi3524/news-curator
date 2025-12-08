import { Star, Heart, Bookmark, Calendar } from 'lucide-react';
import { useState, useEffect } from 'react';
import type { Article } from '@/app/types/types';
import { formatDate } from '@/app/lib/utils';

interface FeaturedArticleProps {
  article: Article;
}

export function FeaturedArticle({ article }: FeaturedArticleProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  return (
    <section className="mb-8 animate-[fadeIn_0.5s_ease-out_0.2s_both]">
      <div className="mb-3 flex items-center gap-2 text-sm font-bold uppercase tracking-wide text-[var(--color-brand-primary)]">
        <Star className="h-4 w-4" />
        <span>注目記事</span>
      </div>

      <a
        href={article.url}
        target="_blank"
        rel="noopener noreferrer"
        className="group relative block cursor-pointer overflow-hidden rounded-xl border-l-4 border-[var(--color-brand-primary)] bg-gradient-to-r from-[#1E293B] to-[#334155] p-10 shadow-[0_4px_20px_rgba(0,0,0,0.08)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_8px_30px_rgba(0,0,0,0.12)] dark:from-[#334155] dark:to-[#475569]"
      >
        {/* Glow effect */}
        <div className="pointer-events-none absolute right-0 top-0 h-[300px] w-[300px] opacity-15 bg-[radial-gradient(circle,var(--color-brand-primary)_0%,transparent_70%)]" />

        <div className="relative z-10">
          {/* Tags */}
          <div className="mb-4 flex flex-wrap gap-2">
            {article.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-md bg-white/10 px-3.5 py-1.5 text-[13px] font-semibold text-white backdrop-blur-[10px]"
              >
                {tag}
              </span>
            ))}
          </div>

          {/* Title */}
          <h2 className="mb-4 line-clamp-2 font-[Sora,sans-serif] text-[2rem] font-bold leading-[1.3] text-white">
            {article.title}
          </h2>

          {/* Summary */}
          <p className="mb-6 line-clamp-2 text-base leading-[1.7] text-white/90">
            {article.description}
          </p>

          {/* Meta */}
          <div className="flex gap-6 text-sm text-white/85">
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
