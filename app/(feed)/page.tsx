"use client";

import { useState } from "react";
import ArticleCard from "./_components/ArticleCard";
import { Article } from "@/app/types/types";

/**
 * フィードページの使用例
 * ArticleCardコンポーネントの実装サンプル
 */
export default function FeedPage() {
  // サンプル記事データ
  const [articles, setArticles] = useState<Article[]>([
    {
      id: "1",
      title: "React 19の新機能と破壊的変更の完全ガイド",
      description:
        "React 19で導入される新しいフック、Server Components、そして注意すべき破壊的変更について詳しく解説します。",
      url: "https://example.com/article/1",
      publishedAt: "2024-11-20T10:00:00Z",
      source: {
        id: "tech-blog",
        name: "Tech Blog",
      },
      author: "山田太郎",
      tags: ["React", "JavaScript", "Frontend"],
      isFavorite: false,
    },
    {
      id: "2",
      title: "Next.js 15 App Routerのパフォーマンス最適化テクニック",
      description:
        "App Routerを使用したNext.jsアプリケーションのパフォーマンスを最大化するための実践的なテクニックを紹介します。",
      url: "https://example.com/article/2",
      publishedAt: "2024-11-19T14:30:00Z",
      source: {
        id: "dev-community",
        name: "Dev Community",
      },
      author: "佐藤花子",
      tags: ["Next.js", "Performance", "React"],
      isFavorite: true,
    },
    {
      id: "3",
      title: "TypeScript 5.3の新機能：型安全性の向上",
      description:
        "TypeScript 5.3で追加された新しい型システムの機能と、より安全なコードを書くためのベストプラクティス。",
      url: "https://example.com/article/3",
      publishedAt: "2024-11-18T09:15:00Z",
      source: {
        id: "typescript-weekly",
        name: "TypeScript Weekly",
      },
      author: "鈴木一郎",
      tags: ["TypeScript", "JavaScript", "Type Safety"],
      isFavorite: false,
    },
  ]);

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
            フィード - ArticleCard使用例
          </h1>
          <p className="mt-2 text-gray-600">
            お気に入り機能付きの記事カードコンポーネントのデモ
          </p>
        </div>
      </header>

      {/* メインコンテンツ */}
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* 記事グリッド */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {articles.map((article) => (
            <ArticleCard
              key={article.id}
              article={article}
              onToggleFavorite={handleToggleFavorite}
            />
          ))}
        </div>

        {/* 使用方法の説明 */}
        <div className="mt-12 rounded-lg border border-gray-200 bg-white p-6">
          <h2 className="mb-4 text-xl font-bold text-gray-900">
            使用方法
          </h2>
          <div className="space-y-4 text-sm text-gray-600">
            <p>
              <strong>お気に入りボタン:</strong>{" "}
              各カードの右上にあるハートアイコンをクリックすると、お気に入り状態が切り替わります。
            </p>
            <p>
              <strong>記事リンク:</strong>{" "}
              カードをクリックすると、新しいタブで記事が開きます。
            </p>
            <p>
              <strong>レスポンシブ:</strong>{" "}
              画面サイズに応じて、1列、2列、3列のグリッドレイアウトに自動調整されます。
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
