import type { Article } from '@/app/types/types';

/**
 * スコアリング設定
 */
const SCORING_CONFIG = {
  /** いいね数をスコアに変換する除数 */
  LIKES_DIVISOR: 5,
  /** ストック数をスコアに変換する除数 */
  STOCKS_DIVISOR: 3,
  /** 各指標の重み */
  WEIGHTS: {
    stocks: 0.4,
    likes: 0.35,
    recency: 0.25,
  },
  /** 新しさスコアの減衰率（1時間あたりの減少ポイント） */
  RECENCY_DECAY_RATE: 2,
  /** スコアの最大値 */
  MAX_SCORE: 100,
} as const;

/**
 * 記事のスコアを計算
 * いいね数、ストック数、新しさを総合的に評価
 */
export function calculateArticleScore(article: Article): number {
  const now = new Date();
  const publishedDate = new Date(article.publishedAt);
  const hoursSincePublished = (now.getTime() - publishedDate.getTime()) / (1000 * 60 * 60);

  // いいね数スコア (0-100点)
  const likesScore = Math.min(
    (article.likesCount || 0) / SCORING_CONFIG.LIKES_DIVISOR,
    SCORING_CONFIG.MAX_SCORE
  );

  // ストック数スコア (0-100点、ストックはいいねより重要視)
  const stocksScore = Math.min(
    (article.stocksCount || 0) / SCORING_CONFIG.STOCKS_DIVISOR,
    SCORING_CONFIG.MAX_SCORE
  );

  // 新しさスコア (0-100点、24時間以内は高スコア)
  const recencyScore = Math.max(
    0,
    SCORING_CONFIG.MAX_SCORE - hoursSincePublished * SCORING_CONFIG.RECENCY_DECAY_RATE
  );

  // 重み付け合計スコア
  const totalScore =
    stocksScore * SCORING_CONFIG.WEIGHTS.stocks +
    likesScore * SCORING_CONFIG.WEIGHTS.likes +
    recencyScore * SCORING_CONFIG.WEIGHTS.recency;

  return totalScore;
}

/**
 * 記事をスコア順にソート
 */
export function sortByScore(articles: Article[]): Article[] {
  return [...articles].sort((a, b) => {
    const scoreA = calculateArticleScore(a);
    const scoreB = calculateArticleScore(b);
    return scoreB - scoreA;
  });
}

/**
 * 最もスコアの高い記事を取得
 */
export function getFeaturedArticle(articles: Article[]): Article | null {
  if (articles.length === 0) return null;
  return sortByScore(articles)[0];
}
