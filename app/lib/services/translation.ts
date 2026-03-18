/**
 * 翻訳サービス
 *
 * サーバーサイドで使用する翻訳機能を提供
 * - Google Translation APIを使用
 * - Upstash Redisによるキャッシュ（cache/redis.ts の共通クライアントを使用）
 */

import { cacheGet, cacheSet } from '@/app/lib/cache/redis';
import {
  GOOGLE_TRANSLATE_API_URL,
  TRANSLATION_TARGET_LANG,
  TRANSLATION_SOURCE_LANG,
  TRANSLATION_CACHE_TTL_SECONDS,
} from '@/app/lib/constants';
import { CACHE_KEYS } from '@/app/types/types';

interface GoogleTranslateResponse {
  data: {
    translations: Array<{
      translatedText: string;
      detectedSourceLanguage?: string;
    }>;
  };
}

/**
 * テキストからキャッシュキーを生成
 */
function getCacheKey(text: string): string {
  const normalized = text.trim().toLowerCase();
  const prefix = normalized.slice(0, 50).replace(/[^a-z0-9]/g, '_');
  return `${CACHE_KEYS.TRANSLATION_PREFIX}${prefix}_${normalized.length}`;
}

/**
 * キャッシュから翻訳を取得
 */
async function getFromCache(key: string): Promise<string | null> {
  return cacheGet<string>(key);
}

/**
 * キャッシュに翻訳を保存
 */
async function setToCache(key: string, value: string): Promise<void> {
  return cacheSet(key, value, TRANSLATION_CACHE_TTL_SECONDS);
}

/**
 * 複数テキストを一括翻訳
 *
 * @param texts 翻訳対象のテキスト配列
 * @returns 翻訳結果の配列（入力と同じ順序）
 */
export async function translateTexts(texts: string[]): Promise<string[]> {
  if (texts.length === 0) return [];

  // キャッシュチェック
  const cacheKeys = texts.map(getCacheKey);
  const cachedResults = await Promise.all(cacheKeys.map(getFromCache));

  // キャッシュミスのテキストを抽出
  const uncachedIndices: number[] = [];
  const uncachedTexts: string[] = [];

  cachedResults.forEach((cached, index) => {
    if (cached === null) {
      uncachedIndices.push(index);
      uncachedTexts.push(texts[index]);
    }
  });

  // 全てキャッシュヒット
  if (uncachedTexts.length === 0) {
    return cachedResults as string[];
  }

  const apiKey = process.env.GOOGLE_TRANSLATE_API_KEY;

  // APIキー未設定時はモック翻訳
  if (!apiKey) {
    console.warn('GOOGLE_TRANSLATE_API_KEY is not set. Using mock translation.');
    const results = texts.map((text, index) => {
      const cached = cachedResults[index];
      if (cached !== null) return cached;
      const mock = `[翻訳] ${text}`;
      setToCache(cacheKeys[index], mock);
      return mock;
    });
    return results;
  }

  // Google Translation API呼び出し
  try {
    const response = await fetch(
      `${GOOGLE_TRANSLATE_API_URL}?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
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

    // キャッシュに保存
    await Promise.all(
      uncachedIndices.map((originalIndex, newIndex) =>
        setToCache(cacheKeys[originalIndex], newTranslations[newIndex])
      )
    );

    // 結果をマージ
    return texts.map((_, index) => {
      const cached = cachedResults[index];
      if (cached !== null) return cached;
      const uncachedPosition = uncachedIndices.indexOf(index);
      return newTranslations[uncachedPosition];
    });
  } catch (error) {
    console.error('Translation error:', error);
    // エラー時は原文を返す
    return texts;
  }
}
