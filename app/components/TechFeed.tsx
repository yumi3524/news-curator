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
import { CategorySelectionModal } from './CategorySelectionModal';
import { getFeaturedArticle, sortByScore } from '@/app/lib/scoring';
import { useFavorites } from '@/app/lib/hooks/useFavorites';
import { useTranslation } from '@/app/lib/hooks/useTranslation';
import { useCategories } from '@/app/lib/hooks/useCategories';

export function TechFeed() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTags, setSelectedTags] = useState<Set<string>>(new Set());
  const [filterMode, setFilterMode] = useState<'OR' | 'AND'>('OR');

  // パーソナルサーチの状態
  const [isPersonalSearchOpen, setIsPersonalSearchOpen] = useState(false);

  // カテゴリ選択モーダルの状態
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);

  // お気に入り機能
  const { isFavorite, toggleFavorite } = useFavorites();

  // 翻訳機能
  const { translateArticles, isTranslating } = useTranslation();

  // カテゴリ機能
  const {
    selectedCategories,
    isOnboardingCompleted,
    categoryTags,
    selectCategories,
    completeOnboarding,
    hasSelectedCategories,
  } = useCategories();

  // 初回アクセス時にモーダル表示
  useEffect(() => {
    if (!isOnboardingCompleted) {
      setIsCategoryModalOpen(true);
    }
  }, [isOnboardingCompleted]);



  /**
   * 記事を取得して翻訳を適用する共通処理
   */
  const fetchAndTranslateArticles = useCallback(
    async (url: string) => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch(url);
        if (!response.ok) throw new Error('記事の取得に失敗しました');
        const data = await response.json();

        // HackerNews記事を自動翻訳
        const translatedArticles = await translateArticles(data.articles || []);
        setArticles(translatedArticles);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'エラーが発生しました');
      } finally {
        setIsLoading(false);
      }
    },
    [translateArticles]
  );

  const fetchArticles = useCallback(() => {
    return fetchAndTranslateArticles('/api/articles');
  }, [fetchAndTranslateArticles]);

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
      // カテゴリフィルタ（OR条件）
      if (hasSelectedCategories) {
        const articleTagsLower = article.tags.map((t) => t.toLowerCase());
        const matchesCategory = articleTagsLower.some((tag) => categoryTags.has(tag));
        if (!matchesCategory) return false;
      }

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
  }, [articles, searchQuery, selectedTags, filterMode, categoryTags, hasSelectedCategories]);

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
    if (type === 'tag') {
      setSelectedTags((prev) => {
        const next = new Set(prev);
        next.delete(value);
        return next;
      });
    } else if (type === 'search') {
      setSearchQuery('');
    }
  };

  // パーソナルサーチハンドラ
  const handlePersonalSearch = useCallback(
    async (searchTags: string[]) => {
      // 選択したタグをLocalStorageに保存
      localStorage.setItem('personal-search-tags', JSON.stringify(searchTags));

      // 複数タグでAPI呼び出し
      const tagsQuery = searchTags.join(',');
      await fetchAndTranslateArticles(`/api/articles?tags=${encodeURIComponent(tagsQuery)}`);
    },
    [fetchAndTranslateArticles]
  );

  // スコアリングで注目記事を選定
  const featuredArticle = useMemo(() => getFeaturedArticle(filteredArticles), [filteredArticles]);

  // 注目記事以外をスコア順にソート
  const regularArticles = useMemo(() => {
    const sorted = sortByScore(filteredArticles);
    return sorted.filter((article) => article.id !== featuredArticle?.id);
  }, [filteredArticles, featuredArticle]);

  return (
    <>
      <Header
        selectedCategories={selectedCategories}
        onCategoryClick={() => setIsCategoryModalOpen(true)}
      />

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

        {isLoading || isTranslating ? (
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

        {/* カテゴリ選択モーダル */}
        <CategorySelectionModal
          isOpen={isCategoryModalOpen}
          onClose={() => {
            if (isOnboardingCompleted) setIsCategoryModalOpen(false);
          }}
          onComplete={(categories) => {
            selectCategories(categories);
            completeOnboarding();
            setIsCategoryModalOpen(false);
          }}
          initialSelection={selectedCategories}
          mode={isOnboardingCompleted ? 'settings' : 'onboarding'}
        />
      </main>
    </>
  );
}
