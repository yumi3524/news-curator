/**
 * 外部ソースから取得した記事データの共通型定義
 */

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
  source: {
    id: string;
    name: string;
  };
  author?: string;
  tags: string[];
  imageUrl?: string;
  likesCount?: number; // いいね数（人気度の指標）
  stocksCount?: number; // ストック数（Qiita特有）
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
  tag?: string;
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
