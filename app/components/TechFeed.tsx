'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import type { Article, TagCount } from '@/app/types/types';
import { Header } from './Header';
import { FilterSection } from './FilterSection';
import { FeaturedArticle } from './FeaturedArticle';
import { ArticleCard } from './ArticleCard';
import { LoadingState } from './LoadingState';
import { EmptyState } from './EmptyState';
import { ErrorState } from './ErrorState';
import { PersonalSearchModal } from './PersonalSearchModal';
import { getFeaturedArticle, sortByScore } from '@/app/lib/scoring';
import { useFavorites } from '@/app/lib/hooks/useFavorites';

export function TechFeed() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTags, setSelectedTags] = useState<Set<string>>(new Set());
  const [filterMode, setFilterMode] = useState<'OR' | 'AND'>('OR');

  // パーソナルサーチの状態
  const [isPersonalSearchOpen, setIsPersonalSearchOpen] = useState(false);
  const [isPersonalSearchMode, setIsPersonalSearchMode] = useState(false); // パーソナルサーチで記事取得中か
  const [personalSearchTags, setPersonalSearchTags] = useState<string[]>([]);

  // お気に入り機能
  const { isFavorite, toggleFavorite } = useFavorites();


  // LocalStorageからパーソナルサーチの設定を復元
  useEffect(() => {
    const saved = localStorage.getItem('personal-search-tags');
    if (saved) {
      try {
        const tags = JSON.parse(saved);
        setPersonalSearchTags(tags);
      } catch (e) {
        console.error('パーソナルサーチの設定読み込みエラー:', e);
      }
    }
  }, []);

  const fetchArticles = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/articles');
      if (!response.ok) throw new Error('記事の取得に失敗しました');
      const data = await response.json();
      setArticles(data.articles || []);
      setIsPersonalSearchMode(false); // 初期読み込み時は通常モード
    } catch (err) {
      setError(err instanceof Error ? err.message : 'エラーが発生しました');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchArticles();
  }, [fetchArticles]);

  const tags = useMemo<TagCount[]>(() => {
    const tagMap = new Map<string, number>();
    articles.forEach((article) => {
      article.tags.forEach((tag) => {
        tagMap.set(tag, (tagMap.get(tag) || 0) + 1);
      });
    });
    return Array.from(tagMap.entries())
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count);
  }, [articles]);

  const filteredArticles = useMemo(() => {
    return articles.filter((article) => {
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const matchesSearch =
          article.title.toLowerCase().includes(query) ||
          article.description.toLowerCase().includes(query) ||
          article.tags.some((tag) => tag.toLowerCase().includes(query));
        if (!matchesSearch) return false;
      }

      if (selectedTags.size > 0) {
        if (filterMode === 'AND') {
          return Array.from(selectedTags).every((tag) => article.tags.includes(tag));
        } else {
          return article.tags.some((tag) => selectedTags.has(tag));
        }
      }

      return true;
    });
  }, [articles, searchQuery, selectedTags, filterMode]);

  const activeFilters = useMemo(() => {
    const filters: Array<{ type: 'search' | 'tag'; value: string }> = [];
    Array.from(selectedTags).forEach((tag) => filters.push({ type: 'tag', value: tag }));
    if (searchQuery) filters.push({ type: 'search', value: searchQuery });
    return filters;
  }, [selectedTags, searchQuery]);

  const handleTagToggle = (tag: string) => {
    setSelectedTags((prev) => {
      const next = new Set(prev);
      if (next.has(tag)) {
        next.delete(tag);
      } else {
        next.add(tag);
      }
      return next;
    });
  };

  const handleRemoveFilter = (type: string, value: string) => {
    const removeFromSet = (setter: React.Dispatch<React.SetStateAction<Set<string>>>) => {
      setter((prev) => {
        const next = new Set(prev);
        next.delete(value);
        return next;
      });
    };

    const handlers: Record<string, () => void> = {
      tag: () => removeFromSet(setSelectedTags),
      search: () => setSearchQuery(''),
    };

    handlers[type]?.();
  };

  // パーソナルサーチハンドラ
  const handlePersonalSearch = async (tags: string[]) => {
    setIsLoading(true);
    setError(null);
    try {
      // 選択したタグをLocalStorageに保存
      localStorage.setItem('personal-search-tags', JSON.stringify(tags));
      setPersonalSearchTags(tags);

      // 複数タグでAPI呼び出し
      const tagsQuery = tags.join(',');
      const response = await fetch(`/api/articles?tags=${encodeURIComponent(tagsQuery)}`);
      if (!response.ok) throw new Error('記事の取得に失敗しました');
      const data = await response.json();
      setArticles(data.articles || []);
      setIsPersonalSearchMode(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'エラーが発生しました');
    } finally {
      setIsLoading(false);
    }
  };

  // スコアリングで注目記事を選定
  const featuredArticle = useMemo(() => getFeaturedArticle(filteredArticles), [filteredArticles]);

  // 注目記事以外をスコア順にソート
  const regularArticles = useMemo(() => {
    const sorted = sortByScore(filteredArticles);
    return sorted.filter((article) => article.id !== featuredArticle?.id);
  }, [filteredArticles, featuredArticle]);

  return (
    <>
      <Header />

      <main className="mx-auto max-w-[1400px] px-4 py-8 md:px-8">
        <FilterSection
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          tags={tags}
          selectedTags={selectedTags}
          onTagToggle={handleTagToggle}
          filterMode={filterMode}
          onFilterModeChange={setFilterMode}
          activeFilters={activeFilters}
          onRemoveFilter={handleRemoveFilter}
          onPersonalSearchClick={() => setIsPersonalSearchOpen(true)}
        />

        {isLoading ? (
          <LoadingState />
        ) : error ? (
          <ErrorState message={error} />
        ) : filteredArticles.length === 0 ? (
          <EmptyState />
        ) : (
          <>
            {featuredArticle && (
              <FeaturedArticle
                article={{ ...featuredArticle, isFavorite: isFavorite(featuredArticle.id) }}
                onTagClick={handleTagToggle}
              />
            )}
            <div className="grid animate-[fadeIn_0.5s_ease-out_0.3s_both] grid-cols-[repeat(auto-fill,minmax(300px,1fr))] gap-6">
              {regularArticles.map((article) => (
                <ArticleCard
                  key={article.id}
                  article={{ ...article, isFavorite: isFavorite(article.id) }}
                  onTagClick={handleTagToggle}
                  onToggleFavorite={() => toggleFavorite(article)}
                />
              ))}
            </div>
          </>
        )}

        {/* パーソナルサーチモーダル */}
        <PersonalSearchModal
          isOpen={isPersonalSearchOpen}
          onClose={() => setIsPersonalSearchOpen(false)}
          availableTags={tags.map(t => t.name)}
          onSearch={handlePersonalSearch}
        />
      </main>
    </>
  );
}
