import { ArticleFetcher, ExternalArticle, FetchOptions } from "./types";
import {
  GITHUB_API_BASE_URL,
  DEFAULT_FETCH_LIMIT,
  CACHE_REVALIDATE_SECONDS,
  MAX_DESCRIPTION_LENGTH,
} from "../constants";

/**
 * GitHub Search API Response Types
 */
interface GitHubRepo {
  id: number;
  name: string;
  full_name: string;
  html_url: string;
  description: string | null;
  owner: {
    login: string;
    avatar_url: string;
  };
  stargazers_count: number;
  forks_count: number;
  language: string | null;
  topics: string[];
  created_at: string;
  updated_at: string;
  pushed_at: string;
}

interface GitHubSearchResponse {
  total_count: number;
  incomplete_results: boolean;
  items: GitHubRepo[];
}

/**
 * GitHub Search API フェッチャー
 * @see https://docs.github.com/en/rest/search/search?apiVersion=2022-11-28
 */
export class GitHubFetcher implements ArticleFetcher {
  private readonly baseUrl = GITHUB_API_BASE_URL;
  private readonly defaultLimit = DEFAULT_FETCH_LIMIT;
  private readonly cacheSeconds = CACHE_REVALIDATE_SECONDS;

  async fetch(options?: FetchOptions): Promise<ExternalArticle[]> {
    try {
      const url = this.buildSearchUrl(options);
      const response = await this.fetchFromApi(url);
      const articles = this.mapToArticles(response.items);

      return this.filterByTags(articles, options);
    } catch (error) {
      console.error("GitHub API からの取得中にエラーが発生しました:", error);
      throw error;
    }
  }

  /**
   * 検索URLを構築
   */
  private buildSearchUrl(options?: FetchOptions): string {
    const limit = options?.limit || this.defaultLimit;
    const days = options?.days || 7;

    // 過去N日間に作成または更新されたリポジトリ
    const dateStr = this.getDateString(days);

    // 検索クエリを構築
    const queryParts: string[] = [];

    // 言語/タグでフィルタリング
    if (options?.tags && options.tags.length > 0) {
      // 複数言語のOR検索
      const langQuery = options.tags
        .map((tag) => `language:${tag}`)
        .join(" ");
      queryParts.push(`(${langQuery})`);
    } else if (options?.tag) {
      queryParts.push(`language:${options.tag}`);
    }

    // 最低スター数
    queryParts.push("stars:>100");

    // 日付フィルター
    queryParts.push(`pushed:>${dateStr}`);

    const query = queryParts.join(" ");
    const params = new URLSearchParams({
      q: query,
      sort: "stars",
      order: "desc",
      per_page: String(limit),
    });

    return `${this.baseUrl}/search/repositories?${params.toString()}`;
  }

  /**
   * N日前の日付文字列を取得
   */
  private getDateString(daysAgo: number): string {
    const date = new Date();
    date.setDate(date.getDate() - daysAgo);
    return date.toISOString().split("T")[0];
  }

  /**
   * GitHub APIから検索結果を取得
   */
  private async fetchFromApi(url: string): Promise<GitHubSearchResponse> {
    const headers: HeadersInit = {
      Accept: "application/vnd.github+json",
      "X-GitHub-Api-Version": "2022-11-28",
    };

    // 環境変数からトークンを取得（レート制限緩和）
    const token = process.env.GITHUB_TOKEN;
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    const response = await fetch(url, {
      method: "GET",
      headers,
      next: { revalidate: this.cacheSeconds },
    });

    if (!response.ok) {
      throw new Error(`GitHub API エラー: ${response.status} ${response.statusText}`);
    }

    return response.json();
  }

  /**
   * GitHubRepoをExternalArticle形式に変換
   */
  private mapToArticles(repos: GitHubRepo[]): ExternalArticle[] {
    return repos.map((repo) => ({
      id: `gh-${repo.id}`,
      title: repo.full_name,
      description: repo.description
        ? repo.description.substring(0, MAX_DESCRIPTION_LENGTH)
        : "",
      url: repo.html_url,
      publishedAt: repo.pushed_at,
      source: "github" as const,
      author: repo.owner.login,
      tags: this.buildTags(repo),
      imageUrl: repo.owner.avatar_url,
      stars: repo.stargazers_count,
      forks: repo.forks_count,
      language: repo.language || undefined,
    }));
  }

  /**
   * リポジトリからタグを構築
   */
  private buildTags(repo: GitHubRepo): string[] {
    const tags: string[] = [];

    // 言語をタグとして追加
    if (repo.language) {
      tags.push(repo.language);
    }

    // トピックスを追加（最大4つ）
    const topicsToAdd = repo.topics.slice(0, 4);
    tags.push(...topicsToAdd);

    // 重複を削除
    return [...new Set(tags)].slice(0, 5);
  }

  /**
   * タグでフィルタリング（API側で対応できない場合の追加フィルタ）
   */
  private filterByTags(
    articles: ExternalArticle[],
    options?: FetchOptions
  ): ExternalArticle[] {
    if (!options?.tags && !options?.tag) {
      return articles;
    }

    const tagsToMatch = options.tags || (options.tag ? [options.tag] : []);
    const tagsLower = tagsToMatch.map((t) => t.toLowerCase());

    return articles.filter((article) =>
      article.tags.some((tag) => tagsLower.includes(tag.toLowerCase()))
    );
  }
}
