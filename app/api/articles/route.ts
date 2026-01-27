import { NextResponse } from "next/server";
import { QiitaAPIFetcher } from "@/app/lib/fetchers/qiita-api";
import { QiitaRSSFetcher } from "@/app/lib/fetchers/qiita";
import { HackerNewsFetcher } from "@/app/lib/fetchers/hackernews";
import { GitHubFetcher } from "@/app/lib/fetchers/github";
import { CacheFetcher } from "@/app/lib/fetchers/cache";
import type { ArticleFetcher, ExternalArticle, FetchOptions } from "@/app/lib/fetchers/types";

/**
 * 記事取得API
 *
 * GET /api/articles
 * GET /api/articles?tags=React,TypeScript
 * GET /api/articles?sources=qiita,hackernews,github
 *
 * クエリパラメータ:
 * - tags: カンマ区切りのタグ（OR検索）
 * - sources: カンマ区切りのソース（qiita, hackernews, github）
 * - limit: 各ソースからの取得件数（デフォルト: 20）
 *
 * データソース切り替え:
 * - 環境変数 ARTICLE_SOURCE で制御（単一ソースモード）
 * - sourcesパラメータで複数ソース指定可能
 */

type ArticleSource = "cache" | "qiita-rss" | "qiita-api" | "hackernews" | "github";
type SourceType = "qiita" | "hackernews" | "github";

function createFetcher(source: ArticleSource): ArticleFetcher {
  switch (source) {
    case "qiita-api":
      return new QiitaAPIFetcher();
    case "qiita-rss":
      return new QiitaRSSFetcher();
    case "hackernews":
      return new HackerNewsFetcher();
    case "github":
      return new GitHubFetcher();
    case "cache":
    default:
      return new CacheFetcher();
  }
}

/**
 * ソース名をフェッチャー名に変換
 */
function sourceToFetcherName(source: SourceType): ArticleSource {
  switch (source) {
    case "qiita":
      return "qiita-api";
    case "hackernews":
      return "hackernews";
    case "github":
      return "github";
    default:
      return "qiita-api";
  }
}

/**
 * 複数ソースから並列で記事を取得
 */
async function fetchFromMultipleSources(
  sources: SourceType[],
  options: FetchOptions
): Promise<ExternalArticle[]> {
  const fetchPromises = sources.map(async (source) => {
    try {
      const fetcherName = sourceToFetcherName(source);
      const fetcher = createFetcher(fetcherName);
      return await fetcher.fetch(options);
    } catch (error) {
      console.error(`Error fetching from ${source}:`, error);
      return []; // エラー時は空配列を返して他のソースは継続
    }
  });

  const results = await Promise.all(fetchPromises);
  const allArticles = results.flat();

  // 日付順にソート
  return allArticles.sort(
    (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  );
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  // クエリパラメータを解析
  const tagsParam = searchParams.get("tags");
  const tags = tagsParam ? tagsParam.split(",").map((t) => t.trim()) : undefined;

  const sourcesParam = searchParams.get("sources");
  const requestedSources = sourcesParam
    ? (sourcesParam.split(",").map((s) => s.trim()) as SourceType[])
    : null;

  const limitParam = searchParams.get("limit");
  const limit = limitParam ? parseInt(limitParam, 10) : 20;

  // 後方互換性: 単一tagパラメータもサポート
  const singleTag = searchParams.get("tag") || undefined;
  const finalTags = tags || (singleTag ? [singleTag] : undefined);

  const fetchOptions: FetchOptions = {
    tags: finalTags,
    limit,
  };

  try {
    let articles: ExternalArticle[];
    let usedSources: string[];

    if (requestedSources && requestedSources.length > 0) {
      // 複数ソースから取得
      articles = await fetchFromMultipleSources(requestedSources, fetchOptions);
      usedSources = requestedSources;
    } else {
      // 環境変数で指定されたソース、またはすべてのソースから取得
      const envSource = process.env.ARTICLE_SOURCE as ArticleSource | undefined;

      if (envSource && envSource !== "cache") {
        // 単一ソースモード
        const fetcher = createFetcher(envSource);
        articles = await fetcher.fetch(fetchOptions);
        usedSources = [envSource];
      } else {
        // デフォルト: すべてのソースから取得
        const allSources: SourceType[] = ["qiita", "hackernews", "github"];
        articles = await fetchFromMultipleSources(allSources, fetchOptions);
        usedSources = allSources;
      }
    }

    return NextResponse.json({
      articles,
      sources: usedSources,
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
