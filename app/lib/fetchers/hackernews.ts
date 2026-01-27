import { ArticleFetcher, ExternalArticle, FetchOptions } from "./types";
import {
  HN_API_BASE_URL,
  DEFAULT_FETCH_LIMIT,
  CACHE_REVALIDATE_SECONDS,
  MAX_DESCRIPTION_LENGTH,
  DEFAULT_DESCRIPTION,
} from "../constants";

/**
 * Hacker News API Response Types
 */
interface HNStory {
  id: number;
  title: string;
  url?: string;
  text?: string;
  by: string;
  time: number;
  score: number;
  descendants?: number; // コメント数
}

/**
 * Hacker News API フェッチャー
 * @see https://github.com/HackerNews/API
 */
export class HackerNewsFetcher implements ArticleFetcher {
  private readonly baseUrl = HN_API_BASE_URL;
  private readonly defaultLimit = DEFAULT_FETCH_LIMIT;
  private readonly cacheSeconds = CACHE_REVALIDATE_SECONDS;

  async fetch(options?: FetchOptions): Promise<ExternalArticle[]> {
    try {
      const storyIds = await this.fetchTopStoryIds();
      const limit = options?.limit || this.defaultLimit;
      const limitedIds = storyIds.slice(0, limit);

      const stories = await this.fetchStories(limitedIds);
      const articles = this.mapToArticles(stories);

      return this.filterAndSortArticles(articles, options);
    } catch (error) {
      console.error("Hacker News API からの取得中にエラーが発生しました:", error);
      throw error;
    }
  }

  /**
   * トップストーリーのID一覧を取得
   */
  private async fetchTopStoryIds(): Promise<number[]> {
    const response = await fetch(`${this.baseUrl}/topstories.json`, {
      next: { revalidate: this.cacheSeconds },
    });

    if (!response.ok) {
      throw new Error(`Hacker News API エラー: ${response.status}`);
    }

    return response.json();
  }

  /**
   * 複数のストーリーを並列取得
   */
  private async fetchStories(ids: number[]): Promise<HNStory[]> {
    const promises = ids.map((id) => this.fetchStory(id));
    const results = await Promise.allSettled(promises);

    return results
      .filter((r): r is PromiseFulfilledResult<HNStory | null> => r.status === "fulfilled")
      .map((r) => r.value)
      .filter((story): story is HNStory => story !== null && story.url !== undefined);
  }

  /**
   * 単一のストーリーを取得
   */
  private async fetchStory(id: number): Promise<HNStory | null> {
    try {
      const response = await fetch(`${this.baseUrl}/item/${id}.json`, {
        next: { revalidate: this.cacheSeconds },
      });

      if (!response.ok) return null;
      return response.json();
    } catch {
      return null;
    }
  }

  /**
   * HNStoryをExternalArticle形式に変換
   */
  private mapToArticles(stories: HNStory[]): ExternalArticle[] {
    return stories.map((story) => {
      const hasText = story.text && story.text.trim().length > 0;
      const description = hasText
        ? this.stripHtml(story.text!).substring(0, MAX_DESCRIPTION_LENGTH) + "..."
        : DEFAULT_DESCRIPTION;

      return {
        id: `hn-${story.id}`,
        title: story.title,
        description,
        url: story.url || `https://news.ycombinator.com/item?id=${story.id}`,
        publishedAt: new Date(story.time * 1000).toISOString(),
        source: "hackernews" as const,
        author: story.by,
        tags: this.extractTags(story),
        score: story.score,
        commentsCount: story.descendants || 0,
      };
    });
  }

  /**
   * HTMLタグを除去
   */
  private stripHtml(html: string): string {
    return html.replace(/<[^>]*>/g, "").trim();
  }

  /**
   * ストーリーからタグを推測
   */
  private extractTags(story: HNStory): string[] {
    const tags: string[] = [];
    const title = story.title.toLowerCase();
    const url = story.url?.toLowerCase() || "";

    // URLからドメインベースのタグを追加
    if (url.includes("github.com")) tags.push("GitHub");
    if (url.includes("youtube.com")) tags.push("Video");
    if (url.includes("arxiv.org")) tags.push("Research");

    // タイトルからテクノロジー関連のキーワードを検出
    const techKeywords: Record<string, string> = {
      rust: "Rust",
      python: "Python",
      javascript: "JavaScript",
      typescript: "TypeScript",
      react: "React",
      "node.js": "Node.js",
      nodejs: "Node.js",
      go: "Go",
      golang: "Go",
      kubernetes: "Kubernetes",
      k8s: "Kubernetes",
      docker: "Docker",
      ai: "AI",
      ml: "Machine Learning",
      llm: "LLM",
      gpt: "AI",
      openai: "AI",
      claude: "AI",
      anthropic: "AI",
      startup: "Startup",
      "yc": "Y Combinator",
      aws: "AWS",
      linux: "Linux",
    };

    for (const [keyword, tag] of Object.entries(techKeywords)) {
      if (title.includes(keyword) && !tags.includes(tag)) {
        tags.push(tag);
      }
    }

    // タグがない場合はデフォルトタグ
    if (tags.length === 0) {
      tags.push("Tech News");
    }

    return tags.slice(0, 5); // 最大5タグ
  }

  /**
   * 記事をフィルタリング・ソート
   */
  private filterAndSortArticles(
    articles: ExternalArticle[],
    options?: FetchOptions
  ): ExternalArticle[] {
    let filtered = articles;

    // タグでフィルタリング
    if (options?.tags && options.tags.length > 0) {
      const tagsLower = options.tags.map((t) => t.toLowerCase());
      filtered = filtered.filter((article) =>
        article.tags.some((tag) => tagsLower.includes(tag.toLowerCase()))
      );
    } else if (options?.tag) {
      const tagLower = options.tag.toLowerCase();
      filtered = filtered.filter((article) =>
        article.tags.some((tag) => tag.toLowerCase().includes(tagLower))
      );
    }

    // スコア順（デフォルト）
    return filtered.sort((a, b) => (b.score || 0) - (a.score || 0));
  }
}
