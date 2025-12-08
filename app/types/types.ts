/**
 * 記事ソース情報
 */
export interface ArticleSource {
  id: string;
  name: string;
}

/**
 * 記事データ構造
 * 将来のAPI統合を考慮した設計
 */
export interface Article {
  id: string;
  title: string;
  description: string;
  url: string;
  publishedAt: string;
  source: ArticleSource;
  author?: string;
  tags: string[];
  imageUrl?: string;
  likesCount?: number; // いいね数
  stocksCount?: number; // ストック数
  isFavorite?: boolean; // お気に入り状態（フィード機能用）
}

/**
 * API レスポンス構造（将来の使用を想定）
 */
export interface ArticlesResponse {
  articles: Article[];
  totalResults: number;
  page?: number;
  pageSize?: number;
}

/**
 * タグまたはソースのカウント情報
 */
export interface TagCount {
  name: string;
  count: number;
}
