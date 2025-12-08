import { ArticleFetcher, ExternalArticle, FetchOptions, QiitaItem } from "./types";

/**
 * Qiita API v2 フェッチャー
 * @see docs/QIITA_API.md
 */
import {
  QIITA_API_BASE_URL,
  DEFAULT_FETCH_LIMIT,
  MIN_STOCKS_COUNT,
  CACHE_REVALIDATE_SECONDS,
  MAX_DESCRIPTION_LENGTH
} from "../constants";

export class QiitaAPIFetcher implements ArticleFetcher {
  private readonly baseUrl = QIITA_API_BASE_URL;
  private readonly defaultLimit = DEFAULT_FETCH_LIMIT;
  private readonly minStocks = MIN_STOCKS_COUNT;
  private readonly cacheSeconds = CACHE_REVALIDATE_SECONDS;

  async fetch(options?: FetchOptions): Promise<ExternalArticle[]> {
    try {
      const url = this.buildUrl(options);
      const items = await this.fetchFromApi(url);
      const articles = this.mapToArticles(items);
      return this.sortArticles(articles, options?.sortBy);
    } catch (error) {
      console.error("Qiita API からの取得中にエラーが発生しました:", error);
      throw error;
    }
  }

  /**
   * APIリクエストURLを構築
   */
  private buildUrl(options?: FetchOptions): string {
    const params = new URLSearchParams({
      page: "1",
      per_page: String(options?.limit || this.defaultLimit),
    });

    const queryParts = this.buildQueryParts(options);
    if (queryParts.length > 0) {
      params.append("query", queryParts.join(' '));
    }

    return `${this.baseUrl}/items?${params.toString()}`;
  }

  /**
   * クエリ文字列の各パーツを構築
   */
  private buildQueryParts(options?: FetchOptions): string[] {
    const parts: string[] = [];

    if (options?.tag) {
      parts.push(`tag:${options.tag}`);
    }

    if (options?.days) {
      const dateStr = this.getDateString(options.days);
      parts.push(`created:>=${dateStr}`);
    }

    parts.push(`stocks:>${this.minStocks}`);

    return parts;
  }

  /**
   * N日前の日付文字列を取得（YYYY-MM-DD形式）
   */
  private getDateString(daysAgo: number): string {
    const date = new Date();
    date.setDate(date.getDate() - daysAgo);
    return date.toISOString().split('T')[0];
  }

  /**
   * Qiita APIから記事を取得
   */
  private async fetchFromApi(url: string): Promise<QiitaItem[]> {
    const headers: HeadersInit = {
      "Content-Type": "application/json",
    };

    // 環境変数からアクセストークンを取得
    const accessToken = process.env.QIITA_ACCESS_TOKEN;
    if (accessToken) {
      headers["Authorization"] = `Bearer ${accessToken}`;
    }

    const response = await fetch(url, {
      method: "GET",
      headers,
      next: {
        revalidate: this.cacheSeconds,
      },
    });

    if (!response.ok) {
      throw new Error(`Qiita API エラー: ${response.status} ${response.statusText}`);
    }

    const items: QiitaItem[] = await response.json();

    if (!Array.isArray(items)) {
      throw new Error("Qiita API のレスポンスが不正です: 配列ではありません");
    }

    return items;
  }

  /**
   * Qiita APIレスポンスをExternalArticle形式に変換
   */
  private mapToArticles(items: QiitaItem[]): ExternalArticle[] {
    return items.map((item) => ({
      id: item.id,
      title: item.title,
      description: this.extractDescription(item.body),
      url: item.url,
      publishedAt: item.created_at,
      source: {
        id: "qiita",
        name: "Qiita",
      },
      author: item.user?.id || "Unknown",
      tags: item.tags.map((t) => t.name),
      imageUrl: item.user?.profile_image_url,
      likesCount: item.likes_count,
      stocksCount: item.stocks_count,
    }));
  }

  /**
   * 記事本文から概要文を抽出
   */
  private extractDescription(body?: string): string {
    if (!body) return "";
    return this.stripMarkdown(body).substring(0, MAX_DESCRIPTION_LENGTH) + "...";
  }

  /**
   * 記事を指定された順序でソート
   * 注意: Qiita APIはquery内でのsort:指定をサポートしていないため、クライアント側でソート
   */
  private sortArticles(
    articles: ExternalArticle[],
    sortBy?: FetchOptions['sortBy']
  ): ExternalArticle[] {
    if (!sortBy) return articles;

    return [...articles].sort((a, b) => {
      switch (sortBy) {
        case 'created':
          return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime();
        case 'likes':
          return (b.likesCount || 0) - (a.likesCount || 0);
        case 'stocks':
          return (b.stocksCount || 0) - (a.stocksCount || 0);
        default:
          return 0;
      }
    });
  }

  /**
   * Markdownからプレーンテキストを抽出（簡易版）
   * 記事の概要文生成に使用
   */
  private stripMarkdown(markdown: string): string {
    return markdown
      // ヘッダー行を削除
      .replace(/^#+\s+.*$/gm, "")
      // リンクを除去 [text](url) -> text
      .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
      // 画像を除去 ![alt](url) -> ""
      .replace(/!\[[^\]]*\]\([^)]+\)/g, "")
      // コードブロックを除去
      .replace(/```[\s\S]*?```/g, "")
      // インラインコードを除去
      .replace(/`([^`]+)`/g, "$1")
      // HTMLタグを除去
      .replace(/<[^>]*>/g, "")
      // 空行を削除
      .replace(/\n\s*\n/g, "\n")
      .trim();
  }
}
