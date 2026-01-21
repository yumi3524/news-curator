import { NextResponse } from "next/server";
import { QiitaRSSFetcher } from "@/app/lib/fetchers/qiita";
import { CacheFetcher } from "@/app/lib/fetchers/cache";
import type { ArticleFetcher } from "@/app/lib/fetchers/types";

/**
 * 記事取得API
 *
 * GET /api/articles
 * GET /api/articles?tag=React
 *
 * データソース切り替え:
 * - 環境変数 ARTICLE_SOURCE で制御
 * - "qiita-rss": Qiita RSSから直接取得（デフォルト）
 * - "cache": ローカル/S3キャッシュから取得
 */

type ArticleSource = "cache" | "qiita-rss";

function createFetcher(source: ArticleSource): ArticleFetcher {
  switch (source) {
    case "qiita-rss":
      return new QiitaRSSFetcher();
    case "cache":
    default:
      return new CacheFetcher();
  }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const tag = searchParams.get("tag") || undefined;
  const source = (process.env.ARTICLE_SOURCE || "qiita-rss") as ArticleSource;

  try {
    const fetcher = createFetcher(source);
    const articles = await fetcher.fetch({ tag, limit: 20 });

    return NextResponse.json({
      articles,
      source,
      count: articles.length,
    });
  } catch (error) {
    console.error("Error in /api/articles:", error);
    return NextResponse.json(
      {
        error: "Failed to fetch articles",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

// Next.js App Routerのキャッシング設定
// 300秒（5分）ごとに再検証（revalidate）
export const revalidate = 300;
