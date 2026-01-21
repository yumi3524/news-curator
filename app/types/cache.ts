/**
 * キャッシュJSON型定義
 * @see docs/cache-schema.md
 */

/**
 * キャッシュデータのルート構造
 */
export interface CacheData {
  schemaVersion: number;
  generatedAt: string;
  source: CacheSource;
  window: CacheWindow;
  articles: CacheArticle[];
  tagCounts: Record<string, number>;
  tagIndex?: Record<string, string[]>;
  stats?: CacheStats;
}

/**
 * 取得元情報
 */
export interface CacheSource {
  name: string;
  type: string;
  endpoint?: string;
  fetchedCount: number;
}

/**
 * 母集団条件
 */
export interface CacheWindow {
  limit: number;
  rangeDays?: number;
  note?: string;
}

/**
 * キャッシュ記事データ
 */
export interface CacheArticle {
  id: string;
  title: string;
  url: string;
  author: CacheAuthor;
  publishedAt: string;
  updatedAt?: string;
  tags: string[];
  likes?: number;
  source: string;
}

/**
 * 著者情報
 */
export interface CacheAuthor {
  id: string;
  name?: string;
  avatarUrl?: string;
}

/**
 * 統計情報
 */
export interface CacheStats {
  uniqueTags?: number;
  totalArticles?: number;
}
