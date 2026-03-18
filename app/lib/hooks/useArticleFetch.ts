import { useState, useEffect, useCallback } from 'react';
import type { Article } from '@/app/types/types';
import { useTranslation } from './useTranslation';

/**
 * 記事取得 + 翻訳のカスタムフック
 */
export function useArticleFetch() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { translateArticles, isTranslating } = useTranslation();

  const fetchAndTranslate = useCallback(
    async (url: string) => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch(url);
        if (!response.ok) throw new Error('記事の取得に失敗しました');
        const data = await response.json();

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
    return fetchAndTranslate('/api/articles');
  }, [fetchAndTranslate]);

  useEffect(() => {
    fetchArticles();
  }, [fetchArticles]);

  return {
    articles,
    isLoading,
    isTranslating,
    error,
    fetchAndTranslate,
  };
}
