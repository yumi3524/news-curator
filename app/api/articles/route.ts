import { NextResponse } from "next/server";
import { QiitaAPIFetcher } from "@/app/lib/fetchers/qiita-api";
import { QiitaRSSFetcher } from "@/app/lib/fetchers/qiita";
import { HackerNewsFetcher } from "@/app/lib/fetchers/hackernews";
import { CacheFetcher } from "@/app/lib/fetchers/cache";
import type { ArticleFetcher, ExternalArticle, FetchOptions } from "@/app/lib/fetchers/types";
import {
  getArticleCache,
  setArticleCache,
  getCacheMeta,
  setCacheMeta,
  getSourceCacheKey,
} from "@/app/lib/cache/redis";
import { ARTICLE_CACHE_TTL_SECONDS } from "@/app/lib/constants";
import { CACHE_KEYS, type ArticleCacheMeta, type Source } from "@/app/types/types";

/**
 * 記事取得API
 *
 * GET /api/articles
 * GET /api/articles?tags=React,TypeScript
 * GET /api/articles?sources=qiita,hackernews
 *
 * クエリパラメータ:
 * - tags: カンマ区切りのタグ（OR検索）
 * - sources: カンマ区切りのソース（qiita, hackernews）
 * - limit: 各ソースからの取得件数（デフォルト: 20）
 *
 * データソース切り替え:
 * - 環境変数 ARTICLE_SOURCE で制御（単一ソースモード）
 * - sourcesパラメータで複数ソース指定可能
 */

type ArticleSource = "cache" | "qiita-rss" | "qiita-api" | "hackernews";
type SourceType = "qiita" | "hackernews";

function createFetcher(source: ArticleSource): ArticleFetcher {
  switch (source) {
    case "qiita-api":
      return new QiitaAPIFetcher();
    case "qiita-rss":
      return new QiitaRSSFetcher();
    case "hackernews":
      return new HackerNewsFetcher();
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

  // キャッシュ無効化フラグ（開発用）
  const forceRefresh = searchParams.get("refresh") === "true";

  // 後方互換性: 単一tagパラメータもサポート
  const singleTag = searchParams.get("tag") || undefined;
  const finalTags = tags || (singleTag ? [singleTag] : undefined);

  const fetchOptions: FetchOptions = {
    tags: finalTags,
    limit,
  };

  // 使用するソースを決定
  const sourcesToUse: SourceType[] = requestedSources && requestedSources.length > 0
    ? requestedSources
    : ["qiita", "hackernews"];

  // キャッシュキーを決定（ソース指定がある場合は個別キー、なければ全体キー）
  const cacheKey = requestedSources && requestedSources.length === 1
    ? getSourceCacheKey(requestedSources[0] as Source)
    : CACHE_KEYS.ARTICLES_ALL;

  try {
    // 1. キャッシュ確認（forceRefresh時はスキップ）
    if (!forceRefresh) {
      const cached = await getArticleCache(cacheKey);
      if (cached && cached.length > 0) {
        // キャッシュヒット: タグフィルタリングを適用して返却
        let filteredArticles = cached;
        if (finalTags && finalTags.length > 0) {
          const tagsLower = finalTags.map((t) => t.toLowerCase());
          filteredArticles = cached.filter((article) =>
            article.tags.some((tag) => tagsLower.includes(tag.toLowerCase()))
          );
        }

        const meta = await getCacheMeta(CACHE_KEYS.ARTICLES_META);

        return NextResponse.json({
          articles: filteredArticles,
          sources: sourcesToUse,
          count: filteredArticles.length,
          fromCache: true,
          cachedAt: meta?.fetchedAt || null,
        });
      }
    }

    // 2. キャッシュミス or 強制更新: 外部APIから取得
    let articles: ExternalArticle[];

    const envSource = process.env.ARTICLE_SOURCE as ArticleSource | undefined;
    if (envSource && envSource !== "cache" && !requestedSources) {
      // 単一ソースモード（環境変数指定）
      const fetcher = createFetcher(envSource);
      articles = await fetcher.fetch(fetchOptions);
    } else {
      // 複数ソースから取得
      articles = await fetchFromMultipleSources(sourcesToUse, fetchOptions);
    }

    // 3. キャッシュに保存
    await setArticleCache(cacheKey, articles, ARTICLE_CACHE_TTL_SECONDS);

    // メタデータも保存
    const meta: ArticleCacheMeta = {
      fetchedAt: new Date().toISOString(),
      sources: sourcesToUse as Source[],
      counts: {
        qiita: articles.filter((a) => a.source === "qiita").length,
        hackernews: articles.filter((a) => a.source === "hackernews").length,
        total: articles.length,
      },
    };
    await setCacheMeta(CACHE_KEYS.ARTICLES_META, meta, ARTICLE_CACHE_TTL_SECONDS);

    return NextResponse.json({
      articles,
      sources: sourcesToUse,
      count: articles.length,
      fromCache: false,
      cachedAt: meta.fetchedAt,
    });
  } catch (error) {
    console.error("Error in /api/articles:", error);

    // エラー時: 古いキャッシュがあれば返却（Stale-while-revalidate）
    const staleCache = await getArticleCache(cacheKey);
    if (staleCache && staleCache.length > 0) {
      console.warn("Returning stale cache due to fetch error");
      return NextResponse.json({
        articles: staleCache,
        sources: sourcesToUse,
        count: staleCache.length,
        fromCache: true,
        stale: true,
        error: "Fetch failed, returning cached data",
      });
    }

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
// Redisキャッシュを使用するため、revalidateは長めに設定（1時間）
// 実際のキャッシュ制御はRedis側のTTL（25時間）で行う
export const revalidate = 3600;
