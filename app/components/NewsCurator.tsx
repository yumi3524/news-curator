'use client';

import { useState, useEffect, useMemo } from 'react';
import type { Article, TagCount } from '@/app/types/types';
import { Header } from './Header';
import { FilterSection } from './FilterSection';
import { FeaturedArticle } from './FeaturedArticle';
import { ArticleCard } from './ArticleCard';
import { LoadingState } from './LoadingState';
import { EmptyState } from './EmptyState';
import { ErrorState } from './ErrorState';
import { getFeaturedArticle, sortByScore } from '@/app/lib/scoring';

export function NewsCurator() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<string>('—');

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSources, setSelectedSources] = useState<Set<string>>(new Set());
  const [selectedTags, setSelectedTags] = useState<Set<string>>(new Set());
  const [filterMode, setFilterMode] = useState<'OR' | 'AND'>('OR');

  const fetchArticles = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/articles');
      if (!response.ok) throw new Error('記事の取得に失敗しました');
      const data = await response.json();
      setArticles(data.articles || []);
      updateLastUpdatedTime();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'エラーが発生しました');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchArticles();
  }, []);

  const updateLastUpdatedTime = () => {
    const now = new Date();
    const timeStr = now.toLocaleTimeString('ja-JP', { hour: '2-digit', minute: '2-digit' });
    setLastUpdated(timeStr);
  };

  const sources = useMemo<TagCount[]>(() => {
    const sourceMap = new Map<string, number>();
    articles.forEach((article) => {
      const name = article.source.name;
      sourceMap.set(name, (sourceMap.get(name) || 0) + 1);
    });
    return Array.from(sourceMap.entries()).map(([name, count]) => ({ name, count }));
  }, [articles]);

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

      if (selectedSources.size > 0 && !selectedSources.has(article.source.name)) {
        return false;
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
  }, [articles, searchQuery, selectedSources, selectedTags, filterMode]);

  const activeFilters = useMemo(() => {
    const filters: Array<{ type: 'search' | 'source' | 'tag'; value: string }> = [];
    Array.from(selectedTags).forEach((tag) => filters.push({ type: 'tag', value: tag }));
    Array.from(selectedSources).forEach((source) => filters.push({ type: 'source', value: source }));
    if (searchQuery) filters.push({ type: 'search', value: searchQuery });
    return filters;
  }, [selectedTags, selectedSources, searchQuery]);

  const handleSourceToggle = (source: string) => {
    setSelectedSources((prev) => {
      const next = new Set(prev);
      next.has(source) ? next.delete(source) : next.add(source);
      return next;
    });
  };

  const handleTagToggle = (tag: string) => {
    setSelectedTags((prev) => {
      const next = new Set(prev);
      next.has(tag) ? next.delete(tag) : next.add(tag);
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
      source: () => removeFromSet(setSelectedSources),
      search: () => setSearchQuery(''),
    };

    handlers[type]?.();
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
      <Header lastUpdated={lastUpdated} onRefresh={fetchArticles} isLoading={isLoading} />

      <main className="mx-auto max-w-[1400px] px-8 py-8">
        <FilterSection
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          sources={sources}
          selectedSources={selectedSources}
          onSourceToggle={handleSourceToggle}
          tags={tags}
          selectedTags={selectedTags}
          onTagToggle={handleTagToggle}
          filterMode={filterMode}
          onFilterModeChange={setFilterMode}
          activeFilters={activeFilters}
          onRemoveFilter={handleRemoveFilter}
        />

        {isLoading ? (
          <LoadingState />
        ) : error ? (
          <ErrorState message={error} />
        ) : filteredArticles.length === 0 ? (
          <EmptyState />
        ) : (
          <>
            {featuredArticle && <FeaturedArticle article={featuredArticle} />}
            <div className="grid animate-[fadeIn_0.5s_ease-out_0.3s_both] grid-cols-[repeat(auto-fill,minmax(380px,1fr))] gap-6">
              {regularArticles.map((article) => (
                <ArticleCard key={article.id} article={article} />
              ))}
            </div>
          </>
        )}
      </main>
    </>
  );
}
