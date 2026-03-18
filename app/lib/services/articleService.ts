import { QiitaAPIFetcher } from "@/app/lib/fetchers/qiita-api";
import { QiitaRSSFetcher } from "@/app/lib/fetchers/qiita";
import { HackerNewsFetcher } from "@/app/lib/fetchers/hackernews";
import { CacheFetcher } from "@/app/lib/fetchers/cache";
import type { ArticleFetcher, ExternalArticle, FetchOptions } from "@/app/lib/fetchers/types";
import { cacheGet, cacheSet, getSourceCacheKey } from "@/app/lib/cache/redis";
import { ARTICLE_CACHE_TTL_SECONDS } from "@/app/lib/constants";
import { CACHE_KEYS, type ArticleCacheMeta, type Source } from "@/app/types/types";
import { translateTexts } from "@/app/lib/services/translation";

type ArticleSource = "cache" | "qiita-rss" | "qiita-api" | "hackernews";
type SourceType = "qiita" | "hackernews";

export interface ArticleQueryParams {
  tags?: string[];
  sources: SourceType[];
  limit: number;
  forceRefresh: boolean;
}

export interface ArticleResult {
  articles: ExternalArticle[];
  sources: SourceType[];
  count: number;
  fromCache: boolean;
  stale?: boolean;
  cachedAt: string | null;
  error?: string;
}

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
 * タグによる記事フィルタリング
 */
export function filterByTags(
  articles: ExternalArticle[],
  tags: string[]
): ExternalArticle[] {
  if (tags.length === 0) return articles;
  const tagsLower = tags.map((t) => t.toLowerCase());
  return articles.filter((article) =>
    article.tags.some((tag) => tagsLower.includes(tag.toLowerCase()))
  );
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
      return [];
    }
  });

  const results = await Promise.all(fetchPromises);
  const allArticles = results.flat();

  return allArticles.sort(
    (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  );
}

/**
 * HackerNews記事の翻訳を適用
 */
async function translateHackerNewsArticles(
  articles: ExternalArticle[]
): Promise<void> {
  const hnArticles = articles.filter((a) => a.source === "hackernews" && !a.isTranslated);
  if (hnArticles.length === 0) return;

  const textsToTranslate = hnArticles.flatMap((a) => [a.title, a.description]);
  const translations = await translateTexts(textsToTranslate);

  hnArticles.forEach((article, index) => {
    article.titleJa = translations[index * 2];
    article.descriptionJa = translations[index * 2 + 1];
    article.isTranslated = true;
  });
}

/**
 * キャッシュキーを決定
 */
export function getCacheKey(params: ArticleQueryParams): string {
  const singleSource = params.sources.length === 1;
  return singleSource
    ? getSourceCacheKey(params.sources[0] as Source)
    : CACHE_KEYS.ARTICLES_ALL;
}

/**
 * 記事取得サービス
 */
export async function getArticles(params: ArticleQueryParams): Promise<ArticleResult> {
  const cacheKey = getCacheKey(params);

  // 1. キャッシュ確認
  if (!params.forceRefresh) {
    const cached = await cacheGet<ExternalArticle[]>(cacheKey);
    if (cached && cached.length > 0) {
      const filteredArticles = params.tags
        ? filterByTags(cached, params.tags)
        : cached;
      const meta = await cacheGet<ArticleCacheMeta>(CACHE_KEYS.ARTICLES_META);

      return {
        articles: filteredArticles,
        sources: params.sources,
        count: filteredArticles.length,
        fromCache: true,
        cachedAt: meta?.fetchedAt || null,
      };
    }
  }

  // 2. 外部APIから取得
  const fetchOptions: FetchOptions = { tags: params.tags, limit: params.limit };
  let articles: ExternalArticle[];

  const envSource = process.env.ARTICLE_SOURCE as ArticleSource | undefined;
  if (envSource && envSource !== "cache" && params.sources.length > 1) {
    const fetcher = createFetcher(envSource);
    articles = await fetcher.fetch(fetchOptions);
  } else {
    articles = await fetchFromMultipleSources(params.sources, fetchOptions);
  }

  // 3. HackerNews記事を翻訳
  await translateHackerNewsArticles(articles);

  // 4. キャッシュに保存
  await cacheSet(cacheKey, articles, ARTICLE_CACHE_TTL_SECONDS);

  const meta: ArticleCacheMeta = {
    fetchedAt: new Date().toISOString(),
    sources: params.sources as Source[],
    counts: {
      qiita: articles.filter((a) => a.source === "qiita").length,
      hackernews: articles.filter((a) => a.source === "hackernews").length,
      total: articles.length,
    },
  };
  await cacheSet(CACHE_KEYS.ARTICLES_META, meta, ARTICLE_CACHE_TTL_SECONDS);

  return {
    articles,
    sources: params.sources,
    count: articles.length,
    fromCache: false,
    cachedAt: meta.fetchedAt,
  };
}

/**
 * エラー時のstaleキャッシュフォールバック
 */
export async function getStaleArticles(
  params: ArticleQueryParams
): Promise<ArticleResult | null> {
  const cacheKey = getCacheKey(params);
  const staleCache = await cacheGet<ExternalArticle[]>(cacheKey);
  if (!staleCache || staleCache.length === 0) return null;

  console.warn("Returning stale cache due to fetch error");
  return {
    articles: staleCache,
    sources: params.sources,
    count: staleCache.length,
    fromCache: true,
    stale: true,
    cachedAt: null,
    error: "Fetch failed, returning cached data",
  };
}
