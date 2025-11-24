import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import ArticleCard from "../ArticleCard";
import { Article } from "@/app/types/types";

/**
 * ArticleCardコンポーネントのテスト
 * 
 * テストの観点:
 * 1. 基本的なレンダリング（タイトル、ソース、日付、タグが表示される）
 * 2. お気に入りボタンの動作（クリックでコールバックが呼ばれる）
 * 3. お気に入り状態の表示切り替え
 * 4. 外部リンクの動作
 */
describe("ArticleCard", () => {
  // テスト用のモックデータ
  const mockArticle: Article = {
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
  };

  const mockOnToggleFavorite = vi.fn();

  // 各テストの前にモック関数をリセット
  beforeEach(() => {
    mockOnToggleFavorite.mockClear();
  });

  it("記事のタイトルが表示される", () => {
    render(
      <ArticleCard
        article={mockArticle}
        onToggleFavorite={mockOnToggleFavorite}
      />
    );

    expect(screen.getByTestId("article-title")).toHaveTextContent(
      "React 19の新機能"
    );
  });

  it("ソース名と公開日が表示される", () => {
    render(
      <ArticleCard
        article={mockArticle}
        onToggleFavorite={mockOnToggleFavorite}
      />
    );

    const meta = screen.getByTestId("article-meta");
    expect(meta).toHaveTextContent("Tech Blog");
    expect(meta).toHaveTextContent("2024年11月20日");
  });

  it("タグが全て表示される", () => {
    render(
      <ArticleCard
        article={mockArticle}
        onToggleFavorite={mockOnToggleFavorite}
      />
    );

    const tags = screen.getByTestId("article-tags");
    expect(tags).toHaveTextContent("React");
    expect(tags).toHaveTextContent("JavaScript");
    expect(tags).toHaveTextContent("Frontend");
  });

  it("お気に入りボタンをクリックするとコールバックが呼ばれる", () => {
    render(
      <ArticleCard
        article={mockArticle}
        onToggleFavorite={mockOnToggleFavorite}
      />
    );

    const favoriteButton = screen.getByTestId("favorite-button");
    fireEvent.click(favoriteButton);

    expect(mockOnToggleFavorite).toHaveBeenCalledTimes(1);
    expect(mockOnToggleFavorite).toHaveBeenCalledWith("1");
  });

  it("お気に入り未登録の場合、枠線ハートが表示される", () => {
    render(
      <ArticleCard
        article={mockArticle}
        onToggleFavorite={mockOnToggleFavorite}
      />
    );

    const favoriteButton = screen.getByTestId("favorite-button");
    expect(favoriteButton).toHaveAttribute(
      "aria-label",
      "お気に入りに追加"
    );
  });

  it("お気に入り登録済みの場合、塗りつぶしハートが表示される", () => {
    const favoriteArticle = { ...mockArticle, isFavorite: true };

    render(
      <ArticleCard
        article={favoriteArticle}
        onToggleFavorite={mockOnToggleFavorite}
      />
    );

    const favoriteButton = screen.getByTestId("favorite-button");
    expect(favoriteButton).toHaveAttribute(
      "aria-label",
      "お気に入りから削除"
    );
  });

  it("記事タイトルのリンクが正しいURLを指している", () => {
    render(
      <ArticleCard
        article={mockArticle}
        onToggleFavorite={mockOnToggleFavorite}
      />
    );

    const link = screen.getByRole("link");
    expect(link).toHaveAttribute("href", "https://example.com/article/1");
    expect(link).toHaveAttribute("target", "_blank");
    expect(link).toHaveAttribute("rel", "noopener noreferrer");
  });

  it("タグが空の場合、タグセクションが表示されない", () => {
    const articleWithoutTags = { ...mockArticle, tags: [] };

    render(
      <ArticleCard
        article={articleWithoutTags}
        onToggleFavorite={mockOnToggleFavorite}
      />
    );

    expect(screen.queryByTestId("article-tags")).not.toBeInTheDocument();
  });
});
