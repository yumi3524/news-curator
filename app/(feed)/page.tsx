"use client";

import { useState, useMemo, useEffect } from "react";
import ArticleCard from "./_components/ArticleCard";
import FilterPanel from "./_components/FilterPanel";
import { Article } from "@/app/types/types";
import {
  filterArticles,
  extractUniqueSources,
  extractUniqueTags,
  type FilterOptions,
} from "@/app/lib/filterArticles";

/**
 * フィードページ
 * フィルタ機能付きの記事一覧を表示
 * Qiita RSSから記事を取得
 */
export default function FeedPage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // フィルタ状態
  const [filters, setFilters] = useState<FilterOptions>({
    selectedSources: [],
    selectedTags: [],
    searchKeyword: "",
  });

  // 記事を取得
  useEffect(() => {
    async function loadArticles() {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch("/api/articles?source=qiita&tag=React&limit=30");

        if (!response.ok) {
          throw new Error(`Failed to fetch articles: ${response.statusText}`);
        }

        const data = await response.json();

        if (!data.articles || !Array.isArray(data.articles)) {
          throw new Error("Invalid API response format");
        }

        // ExternalArticleをArticle形式に変換（isFavoriteを追加）
        const articles: Article[] = data.articles.map(
          (article: any) => ({
            ...article,
            isFavorite: false,
          })
        );

        setArticles(articles);
      } catch (err) {
        console.error("Error loading articles:", err);
        setError(err instanceof Error ? err.message : "Failed to load articles");
      } finally {
        setLoading(false);
      }
    }

    loadArticles();
  }, []);

  // 利用可能なソースとタグ（全記事から抽出）
  const availableSources = useMemo(
    () => extractUniqueSources(articles),
    [articles]
  );
  const availableTags = useMemo(() => extractUniqueTags(articles), [articles]);

  // フィルタリングされた記事
  const filteredArticles = useMemo(
    () => filterArticles(articles, filters),
    [articles, filters]
  );

  /**
   * お気に入りトグルハンドラ
   * 記事のお気に入り状態を切り替える
   */
  const handleToggleFavorite = (articleId: string) => {
    setArticles((prev) =>
      prev.map((article) =>
        article.id === articleId
          ? { ...article, isFavorite: !article.isFavorite }
          : article
      )
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ヘッダー */}
      <header className="border-b border-gray-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900">
            技術記事キュレーション
          </h1>
          <p className="mt-2 text-gray-600">
            外部ソース（Qiita）から最新の技術記事を取得
          </p>
        </div>
      </header>

      {/* メインコンテンツ */}
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-6 lg:flex-row">
          {/* フィルタパネル（サイドバー） */}
          <aside className="w-full lg:w-80">
            <div className="sticky top-4">
              <FilterPanel
                availableSources={availableSources}
                availableTags={availableTags}
                filters={filters}
                onFiltersChange={setFilters}
              />
            </div>
          </aside>

          {/* 記事リスト */}
          <div className="flex-1">
            {loading && (
              <div className="flex items-center justify-center py-12">
                <div className="text-center">
                  <div className="mb-4 inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"></div>
                  <p className="text-gray-600">記事を読み込み中...</p>
                </div>
              </div>
            )}

            {error && (
              <div className="rounded-lg border border-red-200 bg-red-50 p-6">
                <p className="text-red-800">
                  <strong>エラー:</strong> {error}
                </p>
              </div>
            )}

            {!loading && !error && filteredArticles.length === 0 && (
              <div className="rounded-lg border border-gray-200 bg-white p-12 text-center">
                <p className="text-gray-600">
                  条件に一致する記事が見つかりませんでした。
                </p>
              </div>
            )}

            {!loading && !error && filteredArticles.length > 0 && (
              <>
                <div className="mb-4 text-sm text-gray-600">
                  {filteredArticles.length}件の記事が見つかりました
                </div>
                <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
                  {filteredArticles.map((article) => (
                    <ArticleCard
                      key={article.id}
                      article={article}
                      onToggleFavorite={handleToggleFavorite}
                    />
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
