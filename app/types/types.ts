/**
 * Article source information
 */
export interface ArticleSource {
  id: string;
  name: string;
}

/**
 * Article data structure
 * Designed to be compatible with future API integration
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
  isFavorite?: boolean; // お気に入り状態（フィード機能用）
}

/**
 * API response structure (for future use)
 */
export interface ArticlesResponse {
  articles: Article[];
  totalResults: number;
  page?: number;
  pageSize?: number;
}
