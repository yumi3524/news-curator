/**
 * 外部ソースから取得した記事データの共通型定義
 */
import type { Source } from '@/app/types/types';

/**
 * 外部ソースから取得した生の記事データ
 * 各ソースのfetcherがこの型に変換する責任を持つ
 */
export interface ExternalArticle {
  id: string;
  title: string;
  description: string;
  url: string;
  publishedAt: string; // ISO 8601形式
  source: Source;
  author?: string;
  tags: string[];
  imageUrl?: string;

  // Qiita固有
  likesCount?: number;
  stocksCount?: number;

  // Hacker News固有
  score?: number;
  commentsCount?: number;

  // GitHub固有
  stars?: number;
  forks?: number;
  language?: string;

  // 翻訳（HN用）
  titleJa?: string;
  descriptionJa?: string;
  isTranslated?: boolean;

  // 読了時間
  readingTimeMinutes?: number;
}

/**
 * フェッチャーの共通インターフェース
 */
export interface ArticleFetcher {
  /**
   * 記事を取得
   * @param options フェッチオプション（タグ、ユーザーなど）
   * @returns 記事の配列
   */
  fetch(options?: FetchOptions): Promise<ExternalArticle[]>;
}

/**
 * フェッチオプション
 */
export interface FetchOptions {
  tag?: string; // 単一タグ（後方互換性のため保持）
  tags?: string[]; // 複数タグ（OR検索）- パーソナルサーチで使用
  user?: string;
  limit?: number;
  days?: number; // 過去N日間の記事を取得
  sortBy?: 'created' | 'likes' | 'stocks'; // ソート順
}

/**
 * Qiita API Response Types
 */
export interface QiitaUser {
  id: string;
  profile_image_url: string;
}

export interface QiitaTag {
  name: string;
}

export interface QiitaItem {
  id: string;
  title: string;
  body: string;
  url: string;
  created_at: string;
  user?: QiitaUser;
  tags: QiitaTag[];
  likes_count: number;
  stocks_count: number;
}
