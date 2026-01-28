/**
 * 記事キャッシュ用 Upstash Redis プロバイダー
 *
 * 翻訳キャッシュ（app/api/translate/route.ts）と同じパターンを採用
 * - 遅延初期化でリソース消費最小化
 * - Redis未設定時はnullを返却（フォールバック対応）
 * - エラー時はログ出力して継続
 */

import { Redis } from '@upstash/redis';
import type { ExternalArticle } from '../fetchers/types';
import type { ArticleCacheMeta, Source } from '@/app/types/types';

// Redisクライアント（遅延初期化）
let redis: Redis | null = null;
let redisInitialized = false;

/**
 * Redisクライアントを取得（遅延初期化）
 * 環境変数が設定されていない場合はnullを返す
 */
function getRedis(): Redis | null {
  if (redisInitialized) return redis;

  const url = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;

  redisInitialized = true;

  if (!url || !token) {
    console.warn('Upstash Redis is not configured. Article caching is disabled.');
    return null;
  }

  redis = new Redis({ url, token });
  return redis;
}

/**
 * 記事キャッシュを取得
 */
export async function getArticleCache(
  key: string
): Promise<ExternalArticle[] | null> {
  const client = getRedis();
  if (!client) return null;

  try {
    return await client.get<ExternalArticle[]>(key);
  } catch (error) {
    console.error('Redis get error (articles):', error);
    return null;
  }
}

/**
 * 記事キャッシュを保存
 */
export async function setArticleCache(
  key: string,
  articles: ExternalArticle[],
  ttlSeconds: number
): Promise<void> {
  const client = getRedis();
  if (!client) return;

  try {
    await client.set(key, articles, { ex: ttlSeconds });
  } catch (error) {
    console.error('Redis set error (articles):', error);
  }
}

/**
 * キャッシュメタデータを取得
 */
export async function getCacheMeta(
  key: string
): Promise<ArticleCacheMeta | null> {
  const client = getRedis();
  if (!client) return null;

  try {
    return await client.get<ArticleCacheMeta>(key);
  } catch (error) {
    console.error('Redis get error (meta):', error);
    return null;
  }
}

/**
 * キャッシュメタデータを保存
 */
export async function setCacheMeta(
  key: string,
  meta: ArticleCacheMeta,
  ttlSeconds: number
): Promise<void> {
  const client = getRedis();
  if (!client) return;

  try {
    await client.set(key, meta, { ex: ttlSeconds });
  } catch (error) {
    console.error('Redis set error (meta):', error);
  }
}

/**
 * ソースに対応するキャッシュキーを取得
 */
export function getSourceCacheKey(source: Source | 'all'): string {
  switch (source) {
    case 'qiita':
      return 'cache:articles:qiita';
    case 'hackernews':
      return 'cache:articles:hackernews';
    case 'github':
      return 'cache:articles:github';
    case 'all':
    default:
      return 'cache:articles:all';
  }
}

/**
 * Redis接続状態を確認
 */
export function isRedisAvailable(): boolean {
  return getRedis() !== null;
}
