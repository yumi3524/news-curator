import { NextResponse } from "next/server";
import { QiitaAPIFetcher } from "@/app/lib/fetchers/qiita-api";
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
 * - "qiita-api": Qiita API v2から取得（デフォルト、いいね数/タグ取得可能）
 * - "qiita-rss": Qiita RSSから取得（いいね数/タグ取得不可）
 * - "cache": ローカル/S3キャッシュから取得
 */

type ArticleSource = "cache" | "qiita-rss" | "qiita-api";

function createFetcher(source: ArticleSource): ArticleFetcher {
  switch (source) {
    case "qiita-api":
      return new QiitaAPIFetcher();
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
  const source = (process.env.ARTICLE_SOURCE || "qiita-api") as ArticleSource;

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
