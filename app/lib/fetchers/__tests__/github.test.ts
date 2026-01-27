import { describe, it, expect, vi, beforeEach } from "vitest";
import { GitHubFetcher } from "../github";

const context = describe;

// fetchのモック
const mockFetch = vi.fn();
global.fetch = mockFetch;

const mockRepo1 = {
  id: 12345,
  name: "awesome-project",
  full_name: "testuser/awesome-project",
  html_url: "https://github.com/testuser/awesome-project",
  description: "An awesome TypeScript project",
  owner: {
    login: "testuser",
    avatar_url: "https://avatars.githubusercontent.com/u/12345",
  },
  stargazers_count: 5000,
  forks_count: 500,
  language: "TypeScript",
  topics: ["typescript", "react", "nextjs"],
  created_at: "2023-01-01T00:00:00Z",
  updated_at: "2024-01-01T00:00:00Z",
  pushed_at: "2024-01-01T00:00:00Z",
};

const mockRepo2 = {
  id: 67890,
  name: "rust-tool",
  full_name: "rustdev/rust-tool",
  html_url: "https://github.com/rustdev/rust-tool",
  description: "A high-performance Rust CLI tool",
  owner: {
    login: "rustdev",
    avatar_url: "https://avatars.githubusercontent.com/u/67890",
  },
  stargazers_count: 10000,
  forks_count: 1000,
  language: "Rust",
  topics: ["rust", "cli", "performance"],
  created_at: "2023-06-01T00:00:00Z",
  updated_at: "2024-01-02T00:00:00Z",
  pushed_at: "2024-01-02T00:00:00Z",
};

const mockSearchResponse = {
  total_count: 2,
  incomplete_results: false,
  items: [mockRepo1, mockRepo2],
};

describe("GitHubFetcher", () => {
  let fetcher: GitHubFetcher;

  beforeEach(() => {
    fetcher = new GitHubFetcher();
    vi.clearAllMocks();
  });

  describe("fetch", () => {
    context("正常系", () => {
      it("リポジトリを取得できること", async () => {
        mockFetch.mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve(mockSearchResponse),
        });

        const articles = await fetcher.fetch({ limit: 10 });

        expect(articles).toHaveLength(2);
        expect(articles[0].source).toBe("github");
      });

      it("記事がExternalArticle形式に変換されること", async () => {
        mockFetch.mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve({ ...mockSearchResponse, items: [mockRepo1] }),
        });

        const articles = await fetcher.fetch({ limit: 1 });

        expect(articles[0]).toMatchObject({
          id: "gh-12345",
          title: "testuser/awesome-project",
          description: "An awesome TypeScript project",
          url: "https://github.com/testuser/awesome-project",
          source: "github",
          author: "testuser",
          stars: 5000,
          forks: 500,
          language: "TypeScript",
        });
      });

      it("タグが正しく構築されること", async () => {
        mockFetch.mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve({ ...mockSearchResponse, items: [mockRepo1] }),
        });

        const articles = await fetcher.fetch({ limit: 1 });

        // 言語 + トピックス
        expect(articles[0].tags).toContain("TypeScript");
        expect(articles[0].tags).toContain("typescript");
        expect(articles[0].tags).toContain("react");
      });

      it("日付がpushed_atから設定されること", async () => {
        mockFetch.mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve({ ...mockSearchResponse, items: [mockRepo1] }),
        });

        const articles = await fetcher.fetch({ limit: 1 });

        expect(articles[0].publishedAt).toBe("2024-01-01T00:00:00Z");
      });
    });

    context("タグフィルタリング", () => {
      it("言語でフィルタリングできること", async () => {
        mockFetch.mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve(mockSearchResponse),
        });

        const articles = await fetcher.fetch({ tags: ["Rust"] });

        expect(articles).toHaveLength(1);
        expect(articles[0].language).toBe("Rust");
      });

      it("複数タグでフィルタリングできること", async () => {
        mockFetch.mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve(mockSearchResponse),
        });

        const articles = await fetcher.fetch({ tags: ["TypeScript", "Rust"] });

        expect(articles).toHaveLength(2);
      });
    });

    context("エラーハンドリング", () => {
      it("APIエラー時に例外をスローすること", async () => {
        mockFetch.mockResolvedValueOnce({
          ok: false,
          status: 403,
          statusText: "Forbidden",
        });

        await expect(fetcher.fetch()).rejects.toThrow("GitHub API エラー");
      });
    });

    context("URLの構築", () => {
      it("正しい検索クエリが生成されること", async () => {
        mockFetch.mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve({ ...mockSearchResponse, items: [] }),
        });

        await fetcher.fetch({ limit: 10 });

        const calledUrl = mockFetch.mock.calls[0][0];
        expect(calledUrl).toContain("api.github.com/search/repositories");
        expect(calledUrl).toContain("stars%3A%3E100"); // stars:>100
        expect(calledUrl).toContain("sort=stars");
        expect(calledUrl).toContain("order=desc");
      });
    });

    context("空の結果", () => {
      it("結果がない場合は空配列を返すこと", async () => {
        mockFetch.mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve({ total_count: 0, incomplete_results: false, items: [] }),
        });

        const articles = await fetcher.fetch();

        expect(articles).toEqual([]);
      });
    });
  });
});
