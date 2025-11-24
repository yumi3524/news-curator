"use client";

import { useState, useMemo } from "react";
import ArticleCard from "./_components/ArticleCard";
import FilterPanel from "./_components/FilterPanel";
import { Article } from "@/app/types/types";
import { getArticles } from "@/app/data/mockData";
import {
  filterArticles,
  extractUniqueSources,
  extractUniqueTags,
  type FilterOptions,
} from "@/app/lib/filterArticles";

/**
 * フィードページ
 * フィルタ機能付きの記事一覧を表示
 */
export default function FeedPage() {
  // モックデータから記事を取得（お気に入り状態を初期化）
  const initialArticles = getArticles().map((article) => ({
    ...article,
    isFavorite: false,
  }));

  const [articles, setArticles] = useState<Article[]>(initialArticles);

  // フィルタ状態
  const [filters, setFilters] = useState<FilterOptions>({
    selectedSources: [],
    selectedTags: [],
    searchKeyword: "",
  });

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
            最新の技術記事をフィルタリングして閲覧
          </p>
        </div>
      </header>

      {/* メインコンテンツ */}
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid gap-6 lg:grid-cols-[320px_1fr]">
          {/* フィルタパネル */}
          <aside>
            <div className="sticky top-8">
              <FilterPanel
                availableSources={availableSources}
                availableTags={availableTags}
                filters={filters}
                onFiltersChange={setFilters}
              />
            </div>
          </aside>

          {/* 記事リスト */}
          <div>
            {/* 結果表示 */}
            <div className="mb-6">
              <p className="text-sm text-gray-600">
                {filteredArticles.length}件の記事が見つかりました
                {filteredArticles.length !== articles.length &&
                  ` (全${articles.length}件中)`}
              </p>
            </div>

            {/* 記事グリッド */}
            {filteredArticles.length > 0 ? (
              <div className="grid gap-6 sm:grid-cols-2">
                {filteredArticles.map((article) => (
                  <ArticleCard
                    key={article.id}
                    article={article}
                    onToggleFavorite={handleToggleFavorite}
                  />
                ))}
              </div>
            ) : (
              <div className="rounded-lg border border-gray-200 bg-white p-12 text-center">
                <p className="text-gray-600">
                  条件に一致する記事が見つかりませんでした。
                </p>
                <p className="mt-2 text-sm text-gray-500">
                  フィルタ条件を変更してお試しください。
                </p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
