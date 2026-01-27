import { describe, it, expect, vi, beforeEach } from "vitest";
import { HackerNewsFetcher } from "../hackernews";

const context = describe;

// fetchのモック
const mockFetch = vi.fn();
global.fetch = mockFetch;

const mockStoryIds = [1, 2, 3];

const mockStory1 = {
  id: 1,
  title: "Test Story about React",
  url: "https://example.com/react",
  by: "testuser",
  time: 1704067200, // 2024-01-01 00:00:00 UTC
  score: 100,
  descendants: 50,
};

const mockStory2 = {
  id: 2,
  title: "Rust programming guide",
  url: "https://github.com/example/rust",
  by: "rustdev",
  time: 1704153600, // 2024-01-02 00:00:00 UTC
  score: 200,
  descendants: 80,
};

const mockStory3 = {
  id: 3,
  title: "Ask HN: What are you working on?",
  text: "Share your projects here",
  by: "hnuser",
  time: 1704240000, // 2024-01-03 00:00:00 UTC
  score: 50,
  descendants: 30,
};

describe("HackerNewsFetcher", () => {
  let fetcher: HackerNewsFetcher;

  beforeEach(() => {
    fetcher = new HackerNewsFetcher();
    vi.clearAllMocks();
  });

  describe("fetch", () => {
    context("正常系", () => {
      it("トップストーリーを取得できること", async () => {
        mockFetch
          .mockResolvedValueOnce({
            ok: true,
            json: () => Promise.resolve(mockStoryIds),
          })
          .mockResolvedValueOnce({
            ok: true,
            json: () => Promise.resolve(mockStory1),
          })
          .mockResolvedValueOnce({
            ok: true,
            json: () => Promise.resolve(mockStory2),
          })
          .mockResolvedValueOnce({
            ok: true,
            json: () => Promise.resolve(mockStory3),
          });

        const articles = await fetcher.fetch({ limit: 3 });

        // URLがないストーリー（mockStory3）は除外される
        expect(articles).toHaveLength(2);
        expect(articles[0].source).toBe("hackernews");
      });

      it("記事がExternalArticle形式に変換されること", async () => {
        mockFetch
          .mockResolvedValueOnce({
            ok: true,
            json: () => Promise.resolve([1]),
          })
          .mockResolvedValueOnce({
            ok: true,
            json: () => Promise.resolve(mockStory1),
          });

        const articles = await fetcher.fetch({ limit: 1 });

        expect(articles[0]).toMatchObject({
          id: "hn-1",
          title: "Test Story about React",
          url: "https://example.com/react",
          source: "hackernews",
          author: "testuser",
          score: 100,
          commentsCount: 50,
        });
      });

      it("スコア順でソートされること", async () => {
        mockFetch
          .mockResolvedValueOnce({
            ok: true,
            json: () => Promise.resolve([1, 2]),
          })
          .mockResolvedValueOnce({
            ok: true,
            json: () => Promise.resolve(mockStory1),
          })
          .mockResolvedValueOnce({
            ok: true,
            json: () => Promise.resolve(mockStory2),
          });

        const articles = await fetcher.fetch({ limit: 2 });

        // mockStory2のスコア(200)がmockStory1のスコア(100)より高い
        expect(articles[0].score).toBe(200);
        expect(articles[1].score).toBe(100);
      });
    });

    context("タグ抽出", () => {
      it("GitHubのURLからタグが抽出されること", async () => {
        mockFetch
          .mockResolvedValueOnce({
            ok: true,
            json: () => Promise.resolve([2]),
          })
          .mockResolvedValueOnce({
            ok: true,
            json: () => Promise.resolve(mockStory2),
          });

        const articles = await fetcher.fetch({ limit: 1 });

        expect(articles[0].tags).toContain("GitHub");
        expect(articles[0].tags).toContain("Rust");
      });

      it("タイトルからテクノロジーキーワードが検出されること", async () => {
        mockFetch
          .mockResolvedValueOnce({
            ok: true,
            json: () => Promise.resolve([1]),
          })
          .mockResolvedValueOnce({
            ok: true,
            json: () => Promise.resolve(mockStory1),
          });

        const articles = await fetcher.fetch({ limit: 1 });

        expect(articles[0].tags).toContain("React");
      });
    });

    context("エラーハンドリング", () => {
      it("APIエラー時に例外をスローすること", async () => {
        mockFetch.mockResolvedValueOnce({
          ok: false,
          status: 500,
        });

        await expect(fetcher.fetch()).rejects.toThrow("Hacker News API エラー");
      });

      it("個別ストーリー取得失敗時は他のストーリーを返すこと", async () => {
        mockFetch
          .mockResolvedValueOnce({
            ok: true,
            json: () => Promise.resolve([1, 2]),
          })
          .mockResolvedValueOnce({
            ok: false, // 1つ目のストーリー取得失敗
          })
          .mockResolvedValueOnce({
            ok: true,
            json: () => Promise.resolve(mockStory2),
          });

        const articles = await fetcher.fetch({ limit: 2 });

        expect(articles).toHaveLength(1);
        expect(articles[0].id).toBe("hn-2");
      });
    });

    context("フィルタリング", () => {
      it("タグでフィルタリングできること", async () => {
        mockFetch
          .mockResolvedValueOnce({
            ok: true,
            json: () => Promise.resolve([1, 2]),
          })
          .mockResolvedValueOnce({
            ok: true,
            json: () => Promise.resolve(mockStory1),
          })
          .mockResolvedValueOnce({
            ok: true,
            json: () => Promise.resolve(mockStory2),
          });

        const articles = await fetcher.fetch({ tags: ["Rust"] });

        expect(articles).toHaveLength(1);
        expect(articles[0].tags).toContain("Rust");
      });
    });
  });
});
