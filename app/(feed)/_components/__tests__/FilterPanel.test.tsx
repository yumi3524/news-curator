import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import FilterPanel from "../FilterPanel";
import type { FilterOptions } from "@/app/types/types";

// contextはdescribeのエイリアス（日本語的な可読性向上のため）
const context = describe;

/**
 * FilterPanelコンポーネントのテスト
 *
 * フィルタ機能の中核コンポーネントとして、以下をテストします：
 * - キーワード検索
 * - ソースフィルタ（チェックボックス）
 * - タグフィルタ（チップボタン）
 * - フィルタクリア機能
 */

describe("FilterPanel", () => {
  // テスト用のモックデータ
  const mockAvailableSources = [
    { id: "tech-blog", name: "Tech Blog" },
    { id: "dev-community", name: "Dev Community" },
    { id: "qiita", name: "Qiita" },
  ];

  const mockAvailableTags = [
    "React",
    "JavaScript",
    "TypeScript",
    "Next.js",
    "Frontend",
  ];

  const mockOnFiltersChange = vi.fn();

  // 各テストの前にモック関数をリセット
  beforeEach(() => {
    mockOnFiltersChange.mockClear();
  });

  /**
   * テストヘルパー: FilterPanelをレンダリング
   */
  const renderFilterPanel = (filters: FilterOptions = {
    selectedSources: [],
    selectedTags: [],
    searchKeyword: "",
  }) => {
    return render(
      <FilterPanel
        availableSources={mockAvailableSources}
        availableTags={mockAvailableTags}
        filters={filters}
        onFiltersChange={mockOnFiltersChange}
      />
    );
  };

  describe("基本表示", () => {
    context("初期状態の場合", () => {
      it("フィルタパネルのタイトルが表示されること", () => {
        renderFilterPanel();

        expect(screen.getByText("フィルタ")).toBeInTheDocument();
      });

      it("キーワード検索入力欄が表示されること", () => {
        renderFilterPanel();

        const input = screen.getByTestId("keyword-search-input");
        expect(input).toBeInTheDocument();
        expect(input).toHaveAttribute("placeholder", "タイトルやタグで検索...");
      });

      it("すべてのソースが表示されること", () => {
        renderFilterPanel();

        expect(screen.getByTestId("source-checkbox-tech-blog")).toBeInTheDocument();
        expect(screen.getByTestId("source-checkbox-dev-community")).toBeInTheDocument();
        expect(screen.getByTestId("source-checkbox-qiita")).toBeInTheDocument();
      });

      it("すべてのタグが表示されること", () => {
        renderFilterPanel();

        expect(screen.getByTestId("tag-chip-React")).toBeInTheDocument();
        expect(screen.getByTestId("tag-chip-JavaScript")).toBeInTheDocument();
        expect(screen.getByTestId("tag-chip-TypeScript")).toBeInTheDocument();
        expect(screen.getByTestId("tag-chip-Next.js")).toBeInTheDocument();
        expect(screen.getByTestId("tag-chip-Frontend")).toBeInTheDocument();
      });

      it("フィルタが未選択の場合、クリアボタンが表示されないこと", () => {
        renderFilterPanel();

        expect(screen.queryByTestId("clear-filters-button")).not.toBeInTheDocument();
      });
    });
  });

  describe("キーワード検索機能", () => {
    context("キーワードを入力した場合", () => {
      it("入力値が反映されること", () => {
        renderFilterPanel({ selectedSources: [], selectedTags: [], searchKeyword: "" });

        const input = screen.getByTestId("keyword-search-input") as HTMLInputElement;
        fireEvent.change(input, { target: { value: "React" } });

        // onFiltersChangeが正しい引数で呼ばれることを確認
        expect(mockOnFiltersChange).toHaveBeenCalledTimes(1);
        expect(mockOnFiltersChange).toHaveBeenCalledWith({
          selectedSources: [],
          selectedTags: [],
          searchKeyword: "React",
        });
      });

      it("空文字列でもエラーにならないこと", () => {
        renderFilterPanel({ selectedSources: [], selectedTags: [], searchKeyword: "React" });

        const input = screen.getByTestId("keyword-search-input") as HTMLInputElement;
        fireEvent.change(input, { target: { value: "" } });

        expect(mockOnFiltersChange).toHaveBeenCalledWith({
          selectedSources: [],
          selectedTags: [],
          searchKeyword: "",
        });
      });

      it("既存のキーワードが上書きされること", () => {
        renderFilterPanel({ selectedSources: [], selectedTags: [], searchKeyword: "React" });

        const input = screen.getByTestId("keyword-search-input") as HTMLInputElement;
        expect(input.value).toBe("React");

        fireEvent.change(input, { target: { value: "TypeScript" } });

        expect(mockOnFiltersChange).toHaveBeenCalledWith({
          selectedSources: [],
          selectedTags: [],
          searchKeyword: "TypeScript",
        });
      });
    });
  });

  describe("ソースフィルタ機能", () => {
    context("ソースチェックボックスをクリックした場合", () => {
      it("未選択のソースを選択すると、selectedSourcesに追加されること", () => {
        renderFilterPanel();

        const checkbox = screen.getByTestId("source-checkbox-tech-blog");
        fireEvent.click(checkbox);

        // onFiltersChangeが呼ばれ、tech-blogが追加されていることを確認
        expect(mockOnFiltersChange).toHaveBeenCalledTimes(1);
        expect(mockOnFiltersChange).toHaveBeenCalledWith({
          selectedSources: ["tech-blog"],
          selectedTags: [],
          searchKeyword: "",
        });
      });

      it("選択済みのソースを再度クリックすると、selectedSourcesから削除されること", () => {
        renderFilterPanel({
          selectedSources: ["tech-blog"],
          selectedTags: [],
          searchKeyword: "",
        });

        const checkbox = screen.getByTestId("source-checkbox-tech-blog");
        fireEvent.click(checkbox);

        // tech-blogが削除されていることを確認
        expect(mockOnFiltersChange).toHaveBeenCalledWith({
          selectedSources: [],
          selectedTags: [],
          searchKeyword: "",
        });
      });

      it("複数のソースを同時に選択できること", () => {
        renderFilterPanel({
          selectedSources: ["tech-blog"],
          selectedTags: [],
          searchKeyword: "",
        });

        const checkbox = screen.getByTestId("source-checkbox-dev-community");
        fireEvent.click(checkbox);

        // tech-blogとdev-communityの両方が選択されていることを確認
        expect(mockOnFiltersChange).toHaveBeenCalledWith({
          selectedSources: ["tech-blog", "dev-community"],
          selectedTags: [],
          searchKeyword: "",
        });
      });

      it("選択済みのソースはchecked状態になること", () => {
        renderFilterPanel({
          selectedSources: ["tech-blog", "qiita"],
          selectedTags: [],
          searchKeyword: "",
        });

        const techBlogCheckbox = screen.getByTestId("source-checkbox-tech-blog") as HTMLInputElement;
        const devCommunityCheckbox = screen.getByTestId("source-checkbox-dev-community") as HTMLInputElement;
        const qiitaCheckbox = screen.getByTestId("source-checkbox-qiita") as HTMLInputElement;

        expect(techBlogCheckbox.checked).toBe(true);
        expect(devCommunityCheckbox.checked).toBe(false);
        expect(qiitaCheckbox.checked).toBe(true);
      });
    });
  });

  describe("タグフィルタ機能", () => {
    context("タグチップをクリックした場合", () => {
      it("未選択のタグを選択すると、selectedTagsに追加されること", () => {
        renderFilterPanel();

        const tagChip = screen.getByTestId("tag-chip-React");
        fireEvent.click(tagChip);

        expect(mockOnFiltersChange).toHaveBeenCalledWith({
          selectedSources: [],
          selectedTags: ["React"],
          searchKeyword: "",
        });
      });

      it("選択済みのタグを再度クリックすると、selectedTagsから削除されること", () => {
        renderFilterPanel({
          selectedSources: [],
          selectedTags: ["React"],
          searchKeyword: "",
        });

        const tagChip = screen.getByTestId("tag-chip-React");
        fireEvent.click(tagChip);

        expect(mockOnFiltersChange).toHaveBeenCalledWith({
          selectedSources: [],
          selectedTags: [],
          searchKeyword: "",
        });
      });

      it("複数のタグを同時に選択できること", () => {
        renderFilterPanel({
          selectedSources: [],
          selectedTags: ["React"],
          searchKeyword: "",
        });

        const tagChip = screen.getByTestId("tag-chip-TypeScript");
        fireEvent.click(tagChip);

        expect(mockOnFiltersChange).toHaveBeenCalledWith({
          selectedSources: [],
          selectedTags: ["React", "TypeScript"],
          searchKeyword: "",
        });
      });

      it("選択済みのタグは青い背景色になること", () => {
        renderFilterPanel({
          selectedSources: [],
          selectedTags: ["React", "TypeScript"],
          searchKeyword: "",
        });

        const reactChip = screen.getByTestId("tag-chip-React");
        const jsChip = screen.getByTestId("tag-chip-JavaScript");
        const tsChip = screen.getByTestId("tag-chip-TypeScript");

        // 選択済みタグはbg-blue-600クラスを持つ
        expect(reactChip).toHaveClass("bg-blue-600");
        expect(tsChip).toHaveClass("bg-blue-600");

        // 未選択タグはbg-gray-100クラスを持つ
        expect(jsChip).toHaveClass("bg-gray-100");
      });
    });
  });

  describe("フィルタクリア機能", () => {
    context("フィルタが選択されている場合", () => {
      it("クリアボタンが表示されること", () => {
        renderFilterPanel({
          selectedSources: ["tech-blog"],
          selectedTags: ["React"],
          searchKeyword: "test",
        });

        const clearButton = screen.getByTestId("clear-filters-button");
        expect(clearButton).toBeInTheDocument();
        expect(clearButton).toHaveTextContent("すべてクリア (3)");
      });

      it("クリアボタンをクリックするとすべてのフィルタがリセットされること", () => {
        renderFilterPanel({
          selectedSources: ["tech-blog", "qiita"],
          selectedTags: ["React", "TypeScript"],
          searchKeyword: "test",
        });

        const clearButton = screen.getByTestId("clear-filters-button");
        fireEvent.click(clearButton);

        // すべてのフィルタがクリアされることを確認
        expect(mockOnFiltersChange).toHaveBeenCalledWith({
          selectedSources: [],
          selectedTags: [],
          searchKeyword: "",
        });
      });

      it("アクティブフィルタ数が正しく表示されること", () => {
        // ソース2個 + タグ1個 + キーワード1個 = 4個
        renderFilterPanel({
          selectedSources: ["tech-blog", "dev-community"],
          selectedTags: ["React"],
          searchKeyword: "test",
        });

        const clearButton = screen.getByTestId("clear-filters-button");
        expect(clearButton).toHaveTextContent("すべてクリア (4)");
      });

      it("キーワードが空白のみの場合はカウントされないこと", () => {
        // ソース1個 + タグ1個 = 2個（空白のみのキーワードはカウントされない）
        renderFilterPanel({
          selectedSources: ["tech-blog"],
          selectedTags: ["React"],
          searchKeyword: "   ",
        });

        const clearButton = screen.getByTestId("clear-filters-button");
        expect(clearButton).toHaveTextContent("すべてクリア (2)");
      });
    });

    context("フィルタが選択されていない場合", () => {
      it("クリアボタンが表示されないこと", () => {
        renderFilterPanel({
          selectedSources: [],
          selectedTags: [],
          searchKeyword: "",
        });

        expect(screen.queryByTestId("clear-filters-button")).not.toBeInTheDocument();
      });
    });
  });

  describe("複合的なフィルタ操作", () => {
    context("複数のフィルタを組み合わせて操作する場合", () => {
      it("ソース・タグ・キーワードを順次選択しても、他のフィルタが保持されること", () => {
        const { rerender } = renderFilterPanel();

        // 1. ソースを選択
        fireEvent.click(screen.getByTestId("source-checkbox-tech-blog"));
        expect(mockOnFiltersChange).toHaveBeenLastCalledWith({
          selectedSources: ["tech-blog"],
          selectedTags: [],
          searchKeyword: "",
        });

        // 2. タグを選択（ソースも保持）
        rerender(
          <FilterPanel
            availableSources={mockAvailableSources}
            availableTags={mockAvailableTags}
            filters={{ selectedSources: ["tech-blog"], selectedTags: [], searchKeyword: "" }}
            onFiltersChange={mockOnFiltersChange}
          />
        );
        fireEvent.click(screen.getByTestId("tag-chip-React"));
        expect(mockOnFiltersChange).toHaveBeenLastCalledWith({
          selectedSources: ["tech-blog"],
          selectedTags: ["React"],
          searchKeyword: "",
        });

        // 3. キーワードを入力（ソース・タグも保持）
        rerender(
          <FilterPanel
            availableSources={mockAvailableSources}
            availableTags={mockAvailableTags}
            filters={{ selectedSources: ["tech-blog"], selectedTags: ["React"], searchKeyword: "" }}
            onFiltersChange={mockOnFiltersChange}
          />
        );
        fireEvent.change(screen.getByTestId("keyword-search-input"), {
          target: { value: "hooks" },
        });
        expect(mockOnFiltersChange).toHaveBeenLastCalledWith({
          selectedSources: ["tech-blog"],
          selectedTags: ["React"],
          searchKeyword: "hooks",
        });
      });
    });
  });
});
