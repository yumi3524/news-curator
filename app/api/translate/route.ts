import { NextResponse } from 'next/server';
import { Redis } from '@upstash/redis';
import {
  GOOGLE_TRANSLATE_API_URL,
  TRANSLATION_TARGET_LANG,
  TRANSLATION_SOURCE_LANG,
  TRANSLATION_CACHE_TTL_SECONDS,
} from '@/app/lib/constants';
import { CACHE_KEYS } from '@/app/types/types';

/**
 * 翻訳API
 *
 * POST /api/translate
 *
 * リクエスト:
 * { texts: string[] }
 *
 * レスポンス:
 * { translations: string[], cached: boolean, mock: boolean }
 *
 * キャッシュ:
 * - Upstash Redisに保存（全ユーザー共通）
 * - キー形式: cache:translation:{hash}
 * - TTL: 30日間
 *
 * 注意:
 * - APIキー未設定時はモック翻訳（原文に[翻訳]プレフィックス）を返す
 * - Upstash Redis未設定時はキャッシュなしで動作
 */

interface TranslateRequest {
  texts: string[];
}

interface GoogleTranslateResponse {
  data: {
    translations: Array<{
      translatedText: string;
      detectedSourceLanguage?: string;
    }>;
  };
}

/**
 * Upstash Redisクライアント（遅延初期化）
 * getRedis()がnullを返す場合はRedis未設定
 */
let redis: Redis | null = null;
let redisInitialized = false;

function getRedis(): Redis | null {
  if (redisInitialized) return redis;

  // Vercel経由の場合は KV_* 変数、直接Upstashの場合は UPSTASH_* 変数
  const url = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;

  redisInitialized = true;
  if (!url || !token) return null;

  redis = new Redis({ url, token });
  return redis;
}

/**
 * テキストからキャッシュキーを生成
 */
function getCacheKey(text: string): string {
  // シンプルなハッシュ（テキストの先頭50文字 + 長さ）
  const normalized = text.trim().toLowerCase();
  const prefix = normalized.slice(0, 50).replace(/[^a-z0-9]/g, '_');
  return `${CACHE_KEYS.TRANSLATION_PREFIX}${prefix}_${normalized.length}`;
}

/**
 * Upstash Redisからキャッシュを取得（Redis未設定時はスキップ）
 */
async function getFromCache(key: string): Promise<string | null> {
  const client = getRedis();
  if (!client) return null;

  try {
    return await client.get<string>(key);
  } catch (error) {
    console.error('Upstash Redis get error:', error);
    return null;
  }
}

/**
 * Upstash Redisにキャッシュを保存（Redis未設定時はスキップ）
 */
async function setToCache(key: string, value: string): Promise<void> {
  const client = getRedis();
  if (!client) return;

  try {
    await client.set(key, value, { ex: TRANSLATION_CACHE_TTL_SECONDS });
  } catch (error) {
    console.error('Upstash Redis set error:', error);
  }
}

export async function POST(request: Request) {
  try {
    const body: TranslateRequest = await request.json();
    const { texts } = body;

    if (!texts || !Array.isArray(texts) || texts.length === 0) {
      return NextResponse.json(
        { error: 'texts配列が必要です' },
        { status: 400 }
      );
    }

    // キャッシュチェック
    const cacheKeys = texts.map(getCacheKey);
    const cachedResults: (string | null)[] = await Promise.all(
      cacheKeys.map(getFromCache)
    );

    // キャッシュヒットしたものと未翻訳のものを分離
    const uncachedIndices: number[] = [];
    const uncachedTexts: string[] = [];

    cachedResults.forEach((cached, index) => {
      if (cached === null) {
        uncachedIndices.push(index);
        uncachedTexts.push(texts[index]);
      }
    });

    // 全てキャッシュヒットした場合
    if (uncachedTexts.length === 0) {
      return NextResponse.json({
        translations: cachedResults as string[],
        cached: true,
        mock: false,
      });
    }

    const apiKey = process.env.GOOGLE_TRANSLATE_API_KEY;

    // APIキー未設定時はモック翻訳を返す
    if (!apiKey) {
      console.warn('GOOGLE_TRANSLATE_API_KEY is not set. Using mock translation.');
      const mockTranslations = texts.map((text, index) => {
        const cached = cachedResults[index];
        if (cached !== null) return cached;
        const mock = `[翻訳] ${text}`;
        // モック結果もキャッシュ
        setToCache(cacheKeys[index], mock);
        return mock;
      });
      return NextResponse.json({
        translations: mockTranslations,
        cached: false,
        mock: true,
      });
    }

    // Google Translation API呼び出し（未キャッシュのテキストのみ）
    const response = await fetch(
      `${GOOGLE_TRANSLATE_API_URL}?key=${apiKey}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          q: uncachedTexts,
          target: TRANSLATION_TARGET_LANG,
          source: TRANSLATION_SOURCE_LANG,
          format: 'text',
        }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Google Translation API error:', errorText);
      throw new Error(`Translation API error: ${response.status}`);
    }

    const data: GoogleTranslateResponse = await response.json();
    const newTranslations = data.data.translations.map((t) => t.translatedText);

    // 新しい翻訳結果をキャッシュに保存
    await Promise.all(
      uncachedIndices.map((originalIndex, newIndex) =>
        setToCache(cacheKeys[originalIndex], newTranslations[newIndex])
      )
    );

    // 結果をマージ
    const finalTranslations = texts.map((_, index) => {
      const cached = cachedResults[index];
      if (cached !== null) return cached;
      const uncachedPosition = uncachedIndices.indexOf(index);
      return newTranslations[uncachedPosition];
    });

    return NextResponse.json({
      translations: finalTranslations,
      cached: false,
      mock: false,
    });
  } catch (error) {
    console.error('Translation error:', error);
    return NextResponse.json(
      {
        error: '翻訳に失敗しました',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
