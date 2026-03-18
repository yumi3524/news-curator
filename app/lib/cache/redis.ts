/**
 * Upstash Redis プロバイダー（共通）
 *
 * - 遅延初期化でリソース消費最小化
 * - Redis未設定時はnullを返却（フォールバック対応）
 * - エラー時はログ出力して継続
 */

import { Redis } from '@upstash/redis';
import type { Source } from '@/app/types/types';

// Redisクライアント（遅延初期化・シングルトン）
let redis: Redis | null = null;
let redisInitialized = false;

/**
 * Redisクライアントを取得（遅延初期化）
 * 環境変数が設定されていない場合はnullを返す
 */
export function getRedis(): Redis | null {
  if (redisInitialized) return redis;

  const url = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;

  redisInitialized = true;

  if (!url || !token) {
    console.warn('Upstash Redis is not configured. Caching is disabled.');
    return null;
  }

  redis = new Redis({ url, token });
  return redis;
}

/**
 * ジェネリックなキャッシュ取得
 */
export async function cacheGet<T>(key: string): Promise<T | null> {
  const client = getRedis();
  if (!client) return null;

  try {
    return await client.get<T>(key);
  } catch (error) {
    console.error(`Redis get error [${key}]:`, error);
    return null;
  }
}

/**
 * ジェネリックなキャッシュ保存
 */
export async function cacheSet<T>(
  key: string,
  data: T,
  ttlSeconds: number
): Promise<void> {
  const client = getRedis();
  if (!client) return;

  try {
    await client.set(key, data, { ex: ttlSeconds });
  } catch (error) {
    console.error(`Redis set error [${key}]:`, error);
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
