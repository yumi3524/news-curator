/**
 * データソース型（型安全なリテラル型）
 */
export type Source = 'qiita' | 'hackernews';

/**
 * 記事データ構造
 * 2つのAPI（Qiita/HN）を統一的に扱う共通型
 */
export interface Article {
  id: string;
  title: string;
  description: string;
  url: string;
  publishedAt: string;
  source: Source;
  author?: string;
  tags: string[];

  // 翻訳（Hacker News用）
  titleJa?: string;
  descriptionJa?: string;
  isTranslated?: boolean;

  // 読了時間（分）
  readingTimeMinutes?: number;

  // Qiita固有
  likesCount?: number;
  stocksCount?: number;

  // Hacker News固有
  score?: number;
  commentsCount?: number;

  // UI状態（クライアント側で付与）
  isFavorite?: boolean;
  imageUrl?: string;
}

/**
 * API レスポンス構造
 */
export interface ArticlesResponse {
  articles: Article[];
  totalResults: number;
  page?: number;
  pageSize?: number;
  fetchedAt?: string; // キャッシュ時刻
}

/**
 * タグのカウント情報
 */
export interface TagCount {
  name: string;
  count: number;
}

/**
 * フィルタ条件の型定義
 */
export interface FilterOptions {
  /** 選択されたソース（複数選択可能） */
  selectedSources: Source[];
  /** 選択されたタグ（複数選択可能） */
  selectedTags: string[];
  /** キーワード検索文字列 */
  searchKeyword: string;
}

// ========================================
// ユーザーデータ型
// ========================================

/**
 * 既読記事
 */
export interface ReadArticle {
  articleId: string;
  source: Source;
  readAt: string; // ISO 8601
}

/**
 * ブックマーク
 */
export interface Bookmark {
  articleId: string;
  source: Source;
  savedAt: string; // ISO 8601
  article: Article; // オフライン表示用にスナップショット保存
}

/**
 * 学習統計
 */
export interface UserStats {
  totalRead: number;
  readBySource: Record<Source, number>;
  streak: number; // 連続学習日数
  lastReadDate: string; // YYYY-MM-DD
  weeklyHistory: number[]; // 過去7日の読了数 [今日, 1日前, 2日前, ...]
}

/**
 * ユーザー設定
 */
export interface UserPreferences {
  theme: 'light' | 'dark' | 'system';
  autoTranslate: boolean; // HN記事の自動翻訳
  defaultTab: Source | 'all';
}

// ========================================
// ストレージキー定数
// ========================================

export const USER_STORAGE_KEYS = {
  READ_ARTICLES: 'user:readArticles',
  BOOKMARKS: 'user:bookmarks',
  STATS: 'user:stats',
  PREFERENCES: 'user:preferences',
  CATEGORIES: 'user:categories',
} as const;

export const CACHE_KEYS = {
  // 記事キャッシュ
  ARTICLES_ALL: 'cache:articles:all',
  ARTICLES_QIITA: 'cache:articles:qiita',
  ARTICLES_HACKERNEWS: 'cache:articles:hackernews',
  ARTICLES_META: 'cache:articles:meta',
  // 翻訳キャッシュ（v2: モックキャッシュ無効化のためプレフィックス変更）
  TRANSLATION_PREFIX: 'cache:translation:v2:',
  // 後方互換性のため残す（非推奨）
  /** @deprecated ARTICLES_QIITA を使用 */
  QIITA_ARTICLES: 'cache:qiita',
  /** @deprecated ARTICLES_HACKERNEWS を使用 */
  HN_ARTICLES: 'cache:hackernews',
  /** @deprecated ARTICLES_META を使用 */
  LAST_FETCH: 'cache:lastFetch',
} as const;

/**
 * 翻訳キャッシュデータ（Upstash Redisに保存）
 */
export interface TranslationCache {
  articleId: string;
  titleJa: string;
  descriptionJa: string;
  translatedAt: string; // ISO 8601
}

/**
 * 記事キャッシュメタデータ
 */
export interface ArticleCacheMeta {
  fetchedAt: string; // ISO 8601
  sources: Source[];
  counts: {
    qiita: number;
    hackernews: number;
    total: number;
  };
}

// ========================================
// カテゴリ関連型
// ========================================

import type { CategoryId } from '@/app/lib/categoryMapping';
export type { CategoryId };

/**
 * ユーザーのカテゴリ選択設定
 */
export interface UserCategoryPreferences {
  selectedCategories: CategoryId[];
  isOnboardingCompleted: boolean;
  updatedAt: string; // ISO 8601
}
