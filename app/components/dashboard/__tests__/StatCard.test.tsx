import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { BookOpen } from "lucide-react";
import { StatCard } from "../StatCard";

const context = describe;

describe("StatCard", () => {
  describe("基本表示", () => {
    context("必須プロパティのみ渡された場合", () => {
      it("ラベルが表示されること", () => {
        render(<StatCard label="今週読んだ記事" value={42} />);

        expect(screen.getByTestId("stat-card-label")).toHaveTextContent(
          "今週読んだ記事"
        );
      });

      it("数値の値が表示されること", () => {
        render(<StatCard label="今週読んだ記事" value={42} />);

        expect(screen.getByTestId("stat-card-value")).toHaveTextContent("42");
      });

      it("文字列の値が表示されること", () => {
        render(<StatCard label="総読書時間" value="4.5h" />);

        expect(screen.getByTestId("stat-card-value")).toHaveTextContent("4.5h");
      });

      it("トレンドが表示されないこと", () => {
        render(<StatCard label="今週読んだ記事" value={42} />);

        expect(screen.queryByTestId("stat-card-trend")).not.toBeInTheDocument();
      });

      it("アイコンが表示されないこと", () => {
        render(<StatCard label="今週読んだ記事" value={42} />);

        expect(screen.queryByTestId("stat-card-icon")).not.toBeInTheDocument();
      });
    });
  });

  describe("トレンド表示", () => {
    context("上昇トレンドの場合", () => {
      it("トレンドテキストが表示されること", () => {
        render(
          <StatCard
            label="今週読んだ記事"
            value={42}
            trend="+12%"
            trendDirection="up"
          />
        );

        const trendElement = screen.getByTestId("stat-card-trend");
        expect(trendElement).toHaveTextContent("+12%");
      });

      it("上昇トレンドのスタイルが適用されること", () => {
        render(
          <StatCard
            label="今週読んだ記事"
            value={42}
            trend="+12%"
            trendDirection="up"
          />
        );

        const trendElement = screen.getByTestId("stat-card-trend");
        expect(trendElement).toHaveClass("text-[var(--color-success)]");
      });
    });

    context("下降トレンドの場合", () => {
      it("トレンドテキストが表示されること", () => {
        render(
          <StatCard
            label="今週読んだ記事"
            value={28}
            trend="-8%"
            trendDirection="down"
          />
        );

        const trendElement = screen.getByTestId("stat-card-trend");
        expect(trendElement).toHaveTextContent("-8%");
      });

      it("下降トレンドのスタイルが適用されること", () => {
        render(
          <StatCard
            label="今週読んだ記事"
            value={28}
            trend="-8%"
            trendDirection="down"
          />
        );

        const trendElement = screen.getByTestId("stat-card-trend");
        expect(trendElement).toHaveClass("text-[var(--color-error)]");
      });
    });

    context("ニュートラルトレンドの場合", () => {
      it("ニュートラルトレンドのスタイルが適用されること", () => {
        render(
          <StatCard
            label="今週読んだ記事"
            value={35}
            trend="先週と同じ"
            trendDirection="neutral"
          />
        );

        const trendElement = screen.getByTestId("stat-card-trend");
        expect(trendElement).toHaveClass("text-[var(--color-text-tertiary)]");
      });
    });
  });

  describe("アイコン表示", () => {
    context("アイコンが渡された場合", () => {
      it("アイコンコンテナが表示されること", () => {
        render(
          <StatCard
            label="今週読んだ記事"
            value={42}
            icon={<BookOpen data-testid="book-icon" />}
          />
        );

        expect(screen.getByTestId("stat-card-icon")).toBeInTheDocument();
      });

      it("アイコンが正しくレンダリングされること", () => {
        render(
          <StatCard
            label="今週読んだ記事"
            value={42}
            icon={<BookOpen data-testid="book-icon" />}
          />
        );

        expect(screen.getByTestId("book-icon")).toBeInTheDocument();
      });
    });
  });

  describe("完全な状態", () => {
    context("すべてのプロパティが渡された場合", () => {
      it("すべての要素が表示されること", () => {
        render(
          <StatCard
            label="今週読んだ記事"
            value={42}
            trend="+12%"
            trendDirection="up"
            icon={<BookOpen data-testid="book-icon" />}
          />
        );

        expect(screen.getByTestId("stat-card-label")).toBeInTheDocument();
        expect(screen.getByTestId("stat-card-value")).toBeInTheDocument();
        expect(screen.getByTestId("stat-card-trend")).toBeInTheDocument();
        expect(screen.getByTestId("stat-card-icon")).toBeInTheDocument();
      });
    });
  });
});
