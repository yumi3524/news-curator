import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { SourceTabs } from "../SourceTabs";

const context = describe;

describe("SourceTabs", () => {
  const mockOnTabChange = vi.fn();

  beforeEach(() => {
    mockOnTabChange.mockClear();
  });

  describe("基本表示", () => {
    context("初期状態の場合", () => {
      it("すべてのタブが表示されること", () => {
        render(<SourceTabs activeTab="all" onTabChange={mockOnTabChange} />);

        expect(screen.getByRole("tab", { name: /すべて/i })).toBeInTheDocument();
        expect(screen.getByRole("tab", { name: /Qiita/i })).toBeInTheDocument();
        expect(screen.getByRole("tab", { name: /HN/i })).toBeInTheDocument();
      });

      it("tablistロールが設定されていること", () => {
        render(<SourceTabs activeTab="all" onTabChange={mockOnTabChange} />);

        expect(screen.getByRole("tablist")).toBeInTheDocument();
      });

      it("アクティブなタブにaria-selected=trueが設定されること", () => {
        render(<SourceTabs activeTab="qiita" onTabChange={mockOnTabChange} />);

        const qiitaTab = screen.getByRole("tab", { name: /Qiita/i });
        expect(qiitaTab).toHaveAttribute("aria-selected", "true");
      });

      it("非アクティブなタブにaria-selected=falseが設定されること", () => {
        render(<SourceTabs activeTab="qiita" onTabChange={mockOnTabChange} />);

        const allTab = screen.getByRole("tab", { name: /すべて/i });
        expect(allTab).toHaveAttribute("aria-selected", "false");
      });
    });
  });

  describe("カウント表示", () => {
    context("countsが渡された場合", () => {
      it("各タブにカウントが表示されること", () => {
        render(
          <SourceTabs
            activeTab="all"
            onTabChange={mockOnTabChange}
            counts={{
              all: 33,
              qiita: 15,
              hackernews: 18,
            }}
          />
        );

        expect(screen.getByText("33")).toBeInTheDocument();
        expect(screen.getByText("15")).toBeInTheDocument();
        expect(screen.getByText("18")).toBeInTheDocument();
      });
    });

    context("countsが渡されない場合", () => {
      it("カウントが表示されないこと", () => {
        render(<SourceTabs activeTab="all" onTabChange={mockOnTabChange} />);

        // タブのラベルのみで数字がないことを確認
        const tabs = screen.getAllByRole("tab");
        expect(tabs).toHaveLength(3);
      });
    });

    context("一部のcountsのみ渡された場合", () => {
      it("渡されたカウントのみ表示されること", () => {
        render(
          <SourceTabs
            activeTab="all"
            onTabChange={mockOnTabChange}
            counts={{
              qiita: 15,
              hackernews: 8,
            }}
          />
        );

        expect(screen.getByText("15")).toBeInTheDocument();
        expect(screen.getByText("8")).toBeInTheDocument();
        expect(screen.queryByText("42")).not.toBeInTheDocument();
      });
    });
  });

  describe("タブ切り替え", () => {
    context("タブをクリックした場合", () => {
      it("allタブをクリックするとonTabChangeが呼ばれること", () => {
        render(<SourceTabs activeTab="qiita" onTabChange={mockOnTabChange} />);

        fireEvent.click(screen.getByRole("tab", { name: /すべて/i }));

        expect(mockOnTabChange).toHaveBeenCalledWith("all");
        expect(mockOnTabChange).toHaveBeenCalledTimes(1);
      });

      it("qiitaタブをクリックするとonTabChangeが呼ばれること", () => {
        render(<SourceTabs activeTab="all" onTabChange={mockOnTabChange} />);

        fireEvent.click(screen.getByRole("tab", { name: /Qiita/i }));

        expect(mockOnTabChange).toHaveBeenCalledWith("qiita");
      });

      it("hackernewsタブをクリックするとonTabChangeが呼ばれること", () => {
        render(<SourceTabs activeTab="all" onTabChange={mockOnTabChange} />);

        fireEvent.click(screen.getByRole("tab", { name: /HN/i }));

        expect(mockOnTabChange).toHaveBeenCalledWith("hackernews");
      });

    });
  });

  describe("アクティブタブの状態", () => {
    context("各タブがアクティブな場合", () => {
      it("すべてタブがアクティブな場合に正しく表示されること", () => {
        render(<SourceTabs activeTab="all" onTabChange={mockOnTabChange} />);

        const allTab = screen.getByRole("tab", { name: /すべて/i });
        expect(allTab).toHaveAttribute("aria-selected", "true");
      });

      it("Qiitaタブがアクティブな場合に正しく表示されること", () => {
        render(<SourceTabs activeTab="qiita" onTabChange={mockOnTabChange} />);

        const qiitaTab = screen.getByRole("tab", { name: /Qiita/i });
        expect(qiitaTab).toHaveAttribute("aria-selected", "true");
      });

      it("HNタブがアクティブな場合に正しく表示されること", () => {
        render(<SourceTabs activeTab="hackernews" onTabChange={mockOnTabChange} />);

        const hnTab = screen.getByRole("tab", { name: /HN/i });
        expect(hnTab).toHaveAttribute("aria-selected", "true");
      });
    });
  });
});
