'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
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
import { useCategories } from '@/app/lib/hooks/useCategories';
import { useArticleFetch } from '@/app/lib/hooks/useArticleFetch';
import { useArticleFilter } from '@/app/lib/hooks/useArticleFilter';

export function TechFeed() {
  const [isPersonalSearchOpen, setIsPersonalSearchOpen] = useState(false);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);

  const { isFavorite, toggleFavorite } = useFavorites();
  const { articles, isLoading, isTranslating, error, fetchAndTranslate } = useArticleFetch();

  const {
    selectedCategories,
    isOnboardingCompleted,
    categoryTags,
    selectCategories,
    completeOnboarding,
    hasSelectedCategories,
  } = useCategories();

  const {
    searchQuery,
    setSearchQuery,
    selectedTags,
    filterMode,
    setFilterMode,
    tags,
    filteredArticles,
    activeFilters,
    handleTagToggle,
    handleRemoveFilter,
  } = useArticleFilter({ articles, categoryTags, hasSelectedCategories });

  // 初回アクセス時にモーダル表示
  useEffect(() => {
    if (!isOnboardingCompleted) {
      setIsCategoryModalOpen(true);
    }
  }, [isOnboardingCompleted]);

  // パーソナルサーチハンドラ
  const handlePersonalSearch = useCallback(
    async (searchTags: string[]) => {
      localStorage.setItem('personal-search-tags', JSON.stringify(searchTags));
      const tagsQuery = searchTags.join(',');
      await fetchAndTranslate(`/api/articles?tags=${encodeURIComponent(tagsQuery)}`);
    },
    [fetchAndTranslate]
  );

  // スコアリングで注目記事を選定
  const featuredArticle = useMemo(() => getFeaturedArticle(filteredArticles), [filteredArticles]);

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

        <PersonalSearchModal
          isOpen={isPersonalSearchOpen}
          onClose={() => setIsPersonalSearchOpen(false)}
          availableTags={tags.map(t => t.name)}
          onSearch={handlePersonalSearch}
        />

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
