'use client';

import { useState, useCallback } from 'react';
import type { Article } from '@/app/types/types';
import { TRANSLATION_BATCH_SIZE, DEFAULT_DESCRIPTION } from '@/app/lib/constants';

/**
 * 翻訳が必要なdescriptionかどうかを判定
 */
function shouldTranslateDescription(description: string | undefined): boolean {
  if (!description) return false;
  if (description === DEFAULT_DESCRIPTION) return false;
  return true;
}

/**
 * 翻訳API レスポンス
 */
interface TranslateResponse {
  translations: string[];
  cached: boolean;
  mock: boolean;
  error?: string;
}

/**
 * useTranslation フックの戻り値
 */
export interface UseTranslationReturn {
  /** 複数記事を一括翻訳 */
  translateArticles: (articles: Article[]) => Promise<Article[]>;
  /** 単一記事を翻訳 */
  translateArticle: (article: Article) => Promise<Article>;
  /** 翻訳中かどうか */
  isTranslating: boolean;
  /** エラーメッセージ */
  error: string | null;
}

/**
 * 翻訳APIを呼び出す
 */
async function callTranslateAPI(texts: string[]): Promise<string[]> {
  const response = await fetch('/api/translate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ texts }),
  });

  if (!response.ok) {
    throw new Error('翻訳APIエラー');
  }

  const data: TranslateResponse = await response.json();

  if (data.error) {
    throw new Error(data.error);
  }

  return data.translations;
}

/**
 * 記事の翻訳を管理するカスタムフック
 *
 * - HackerNews記事のみ翻訳
 * - バッチ処理で効率化
 * - エラー時は原文を返却
 */
export function useTranslation(): UseTranslationReturn {
  const [isTranslating, setIsTranslating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * 単一記事を翻訳
   */
  const translateArticle = useCallback(
    async (article: Article): Promise<Article> => {
      // HackerNews以外は翻訳不要
      if (article.source !== 'hackernews') {
        return article;
      }

      // 既に翻訳済み
      if (article.isTranslated && article.titleJa) {
        return article;
      }

      try {
        const textsToTranslate = [article.title];
        const needsDescTranslation = shouldTranslateDescription(article.description);
        if (needsDescTranslation) {
          textsToTranslate.push(article.description);
        }

        const translations = await callTranslateAPI(textsToTranslate);
        const titleJa = translations[0];
        const descriptionJa = needsDescTranslation
          ? translations[1]
          : article.description || '';

        return {
          ...article,
          titleJa,
          descriptionJa,
          isTranslated: true,
        };
      } catch (e) {
        console.error('翻訳エラー:', e);
        // エラー時は原文を返す
        return article;
      }
    },
    []
  );

  /**
   * 複数記事を一括翻訳
   */
  const translateArticles = useCallback(
    async (articles: Article[]): Promise<Article[]> => {
      setIsTranslating(true);
      setError(null);

      try {
        // HackerNews記事のみ抽出
        const hnArticles = articles.filter(
          (a) => a.source === 'hackernews' && !a.isTranslated
        );

        // 翻訳不要な場合はそのまま返す
        if (hnArticles.length === 0) {
          return articles;
        }

        // 翻訳対象テキストを収集
        const textMap: Array<{
          articleId: string;
          titleIndex: number;
          descIndex?: number;
        }> = [];
        const allTexts: string[] = [];

        hnArticles.forEach((article) => {
          const titleIndex = allTexts.length;
          allTexts.push(article.title);

          let descIndex: number | undefined;
          if (shouldTranslateDescription(article.description)) {
            descIndex = allTexts.length;
            allTexts.push(article.description);
          }

          textMap.push({ articleId: article.id, titleIndex, descIndex });
        });

        // バッチ処理で翻訳
        const allTranslations: string[] = [];
        for (let i = 0; i < allTexts.length; i += TRANSLATION_BATCH_SIZE) {
          const batch = allTexts.slice(i, i + TRANSLATION_BATCH_SIZE);
          const batchTranslations = await callTranslateAPI(batch);
          allTranslations.push(...batchTranslations);
        }

        // 翻訳結果をマッピング
        const translationMap = new Map<string, { titleJa: string; descriptionJa: string }>();
        textMap.forEach((map, idx) => {
          const article = hnArticles[idx];
          translationMap.set(map.articleId, {
            titleJa: allTranslations[map.titleIndex],
            descriptionJa: map.descIndex !== undefined
              ? allTranslations[map.descIndex]
              : article.description || '',
          });
        });

        // 元の記事配列に翻訳を適用
        return articles.map((article) => {
          if (article.source !== 'hackernews') {
            return article;
          }

          if (article.isTranslated) {
            return article;
          }

          const translation = translationMap.get(article.id);
          if (!translation) {
            return article;
          }

          return {
            ...article,
            titleJa: translation.titleJa,
            descriptionJa: translation.descriptionJa,
            isTranslated: true,
          };
        });
      } catch (e) {
        const message = e instanceof Error ? e.message : '翻訳エラー';
        setError(message);
        console.error('翻訳エラー:', e);
        // エラー時は原文を返す
        return articles;
      } finally {
        setIsTranslating(false);
      }
    },
    []
  );

  return { translateArticles, translateArticle, isTranslating, error };
}
