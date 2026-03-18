import { useState, useMemo, useCallback } from 'react';
import type { Article, TagCount } from '@/app/types/types';

interface UseArticleFilterOptions {
  articles: Article[];
  categoryTags: Set<string>;
  hasSelectedCategories: boolean;
}

/**
 * 記事フィルタリングのカスタムフック
 */
export function useArticleFilter({
  articles,
  categoryTags,
  hasSelectedCategories,
}: UseArticleFilterOptions) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTags, setSelectedTags] = useState<Set<string>>(new Set());
  const [filterMode, setFilterMode] = useState<'OR' | 'AND'>('OR');

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

  const handleTagToggle = useCallback((tag: string) => {
    setSelectedTags((prev) => {
      const next = new Set(prev);
      if (next.has(tag)) {
        next.delete(tag);
      } else {
        next.add(tag);
      }
      return next;
    });
  }, []);

  const handleRemoveFilter = useCallback((type: string, value: string) => {
    if (type === 'tag') {
      setSelectedTags((prev) => {
        const next = new Set(prev);
        next.delete(value);
        return next;
      });
    } else if (type === 'search') {
      setSearchQuery('');
    }
  }, []);

  return {
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
  };
}
