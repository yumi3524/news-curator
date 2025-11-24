import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import ArticleCard from "../ArticleCard";
import { Article } from "@/app/types/types";

// contextはdescribeのエイリアス
const context = describe;

/**
 * ArticleCardコンポーネントのテスト
 */

// テストヘルパー: モック記事データを生成
const createMockArticle = (overrides: Partial<Article> = {}): Article => ({
  id: "1",
  title: "React 19の新機能",
  description: "React 19で導入される新機能について解説します",
  url: "https://example.com/article/1",
  publishedAt: "2024-11-20T10:00:00Z",
  source: {
    id: "tech-blog",
    name: "Tech Blog",
  },
  author: "山田太郎",
  tags: ["React", "JavaScript", "Frontend"],
  isFavorite: false,
  ...overrides,
});

describe("ArticleCard", () => {
  const mockOnToggleFavorite = vi.fn();

  // 各テストの前にモック関数をリセット
  beforeEach(() => {
    mockOnToggleFavorite.mockClear();
  });

  // テストヘルパー: ArticleCardをレンダリング
  const renderArticleCard = (articleOverrides: Partial<Article> = {}) => {
    const article = createMockArticle(articleOverrides);
    return render(
      <ArticleCard
        article={article}
        onToggleFavorite={mockOnToggleFavorite}
      />
    );
  };

  describe("基本表示", () => {
    context("通常の記事データの場合", () => {
      it("記事タイトルが表示されること", () => {
        renderArticleCard({ title: "React 19の新機能" });

        expect(screen.getByTestId("article-title")).toHaveTextContent(
          "React 19の新機能"
        );
      });

      it("ソース名が表示されること", () => {
        renderArticleCard();

        const meta = screen.getByTestId("article-meta");
        expect(meta).toHaveTextContent("Tech Blog");
      });

      it("公開日が表示されること", () => {
        renderArticleCard();

        const meta = screen.getByTestId("article-meta");
        expect(meta).toHaveTextContent("2024年11月20日");
      });
    });
  });

  describe("タグ表示", () => {
    context("タグが設定されている場合", () => {
      it("すべてのタグが表示されること", () => {
        renderArticleCard({ tags: ["React", "JavaScript", "Frontend"] });

        const tags = screen.getByTestId("article-tags");
        expect(tags).toHaveTextContent("React");
        expect(tags).toHaveTextContent("JavaScript");
        expect(tags).toHaveTextContent("Frontend");
      });
    });

    context("タグが空の場合", () => {
      it("タグセクションが表示されないこと", () => {
        renderArticleCard({ tags: [] });

        expect(screen.queryByTestId("article-tags")).not.toBeInTheDocument();
      });
    });
  });

  describe("お気に入り機能", () => {
    context("お気に入り未登録の場合", () => {
      it("枠線ハートアイコンが表示されること", () => {
        renderArticleCard({ isFavorite: false });

        const favoriteButton = screen.getByTestId("favorite-button");
        expect(favoriteButton).toHaveAttribute(
          "aria-label",
          "お気に入りに追加"
        );
      });

      it("お気に入りボタンをクリックするとコールバックが呼ばれること", () => {
        renderArticleCard({ isFavorite: false });

        const favoriteButton = screen.getByTestId("favorite-button");
        fireEvent.click(favoriteButton);

        expect(mockOnToggleFavorite).toHaveBeenCalledTimes(1);
        expect(mockOnToggleFavorite).toHaveBeenCalledWith("1");
      });
    });

    context("お気に入り登録済みの場合", () => {
      it("塗りつぶしハートアイコンが表示されること", () => {
        renderArticleCard({ isFavorite: true });

        const favoriteButton = screen.getByTestId("favorite-button");
        expect(favoriteButton).toHaveAttribute(
          "aria-label",
          "お気に入りから削除"
        );
      });

      it("お気に入りボタンをクリックするとコールバックが呼ばれること", () => {
        renderArticleCard({ isFavorite: true });

        const favoriteButton = screen.getByTestId("favorite-button");
        fireEvent.click(favoriteButton);

        expect(mockOnToggleFavorite).toHaveBeenCalledTimes(1);
        expect(mockOnToggleFavorite).toHaveBeenCalledWith("1");
      });
    });
  });

  describe("外部リンク", () => {
    context("記事URLが設定されている場合", () => {
      it("記事タイトルに正しいリンクが設定されていること", () => {
        renderArticleCard({ url: "https://example.com/article/1" });

        const link = screen.getByRole("link");
        expect(link).toHaveAttribute("href", "https://example.com/article/1");
      });

      it("リンクが新しいタブで開くように設定されていること", () => {
        renderArticleCard();

        const link = screen.getByRole("link");
        expect(link).toHaveAttribute("target", "_blank");
        expect(link).toHaveAttribute("rel", "noopener noreferrer");
      });
    });
  });
});
