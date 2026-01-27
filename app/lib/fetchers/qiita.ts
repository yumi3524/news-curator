import Parser from "rss-parser";
import { ArticleFetcher, ExternalArticle, FetchOptions } from "./types";

/**
 * Qiita RSSフェッチャー
 *
 * 利用規約:
 * - RSSフィードは公式に提供されているため利用可能
 * - スクレイピング禁止
 * - 広告収益化禁止（個人プロジェクトなので問題なし）
 *
 * エンドポイント:
 * - 人気記事: https://qiita.com/popular-items/feed.atom
 * - タグ別: https://qiita.com/tags/{tag}/feed.atom
 */
export class QiitaRSSFetcher implements ArticleFetcher {
  private readonly baseUrl = "https://qiita.com";
  private parser: Parser;

  constructor() {
    this.parser = new Parser();
  }

  async fetch(options?: FetchOptions): Promise<ExternalArticle[]> {
    try {
      // フィードURLの構築
      const feedUrl = options?.tag
        ? `${this.baseUrl}/tags/${encodeURIComponent(options.tag)}/feed.atom`
        : `${this.baseUrl}/popular-items/feed.atom`;

      console.log(`Fetching Qiita RSS from: ${feedUrl}`);

      // RSSフィードを取得してパース
      const feed = await this.parser.parseURL(feedUrl);

      // フィード項目をExternalArticle形式に変換
      const articles: ExternalArticle[] = (feed.items || [])
        .slice(0, options?.limit || 20)
        .map((item, index) => {
          // Qiitaの記事IDはURLから抽出
          const articleId = this.extractArticleId(item.link || item.guid || "");

          // QiitaのRSSフィードにはタグ情報が含まれていないため、
          // options.tagが指定されている場合はそれを使用
          // 人気記事フィードの場合は空配列
          const tags = options?.tag ? [options.tag] : [];

          return {
            id: articleId || `qiita-${Date.now()}-${index}`,
            title: item.title || "No Title",
            description: this.stripHTML(item.contentSnippet || item.content || ""),
            url: item.link || "",
            publishedAt: item.isoDate || item.pubDate || new Date().toISOString(),
            source: 'qiita',
            author: item.creator || item.author,
            tags: tags,
            imageUrl: undefined, // QiitaのRSSフィードには画像URLが含まれていない
          };
        });

      console.log(`Successfully fetched ${articles.length} articles from Qiita`);
      return articles;
    } catch (error) {
      console.error("Error fetching Qiita RSS:", error);
      throw new Error(`Failed to fetch articles from Qiita: ${error}`);
    }
  }

  /**
   * 記事URLから記事IDを抽出
   * 例: https://qiita.com/username/items/abc123 -> abc123
   */
  private extractArticleId(url: string): string {
    const match = url.match(/\/items\/([a-f0-9]+)/);
    return match ? match[1] : "";
  }

  /**
   * HTML タグを除去してプレーンテキストに変換
   */
  private stripHTML(html: string): string {
    return html.replace(/<[^>]*>/g, "").substring(0, 200);
  }
}
