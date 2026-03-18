import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { ProgressBar } from "../ProgressBar";

const context = describe;

describe("ProgressBar", () => {
  describe("基本表示", () => {
    context("必須プロパティのみ渡された場合", () => {
      it("プログレスバーが表示されること", () => {
        render(<ProgressBar value={50} />);

        expect(screen.getByTestId("progress-bar")).toBeInTheDocument();
      });

      it("progressbarロールが設定されていること", () => {
        render(<ProgressBar value={50} />);

        expect(screen.getByRole("progressbar")).toBeInTheDocument();
      });

      it("aria属性が正しく設定されていること", () => {
        render(<ProgressBar value={50} />);

        const progressbar = screen.getByRole("progressbar");
        expect(progressbar).toHaveAttribute("aria-valuenow", "50");
        expect(progressbar).toHaveAttribute("aria-valuemin", "0");
        expect(progressbar).toHaveAttribute("aria-valuemax", "100");
      });
    });
  });

  describe("進捗値", () => {
    context("通常の値の場合", () => {
      it("50%の幅が設定されること", () => {
        render(<ProgressBar value={50} />);

        const fill = screen.getByTestId("progress-bar-fill");
        expect(fill).toHaveStyle({ width: "50%" });
      });

      it("75%の幅が設定されること", () => {
        render(<ProgressBar value={75} />);

        const fill = screen.getByTestId("progress-bar-fill");
        expect(fill).toHaveStyle({ width: "75%" });
      });
    });

    context("0の場合", () => {
      it("0%の幅が設定されること", () => {
        render(<ProgressBar value={0} />);

        const fill = screen.getByTestId("progress-bar-fill");
        expect(fill).toHaveStyle({ width: "0%" });
      });
    });

    context("100の場合", () => {
      it("100%の幅が設定されること", () => {
        render(<ProgressBar value={100} />);

        const fill = screen.getByTestId("progress-bar-fill");
        expect(fill).toHaveStyle({ width: "100%" });
      });
    });

    context("100を超える値の場合", () => {
      it("100%にクランプされること", () => {
        render(<ProgressBar value={150} />);

        const fill = screen.getByTestId("progress-bar-fill");
        expect(fill).toHaveStyle({ width: "100%" });
      });
    });

    context("負の値の場合", () => {
      it("0%にクランプされること", () => {
        render(<ProgressBar value={-10} />);

        const fill = screen.getByTestId("progress-bar-fill");
        expect(fill).toHaveStyle({ width: "0%" });
      });
    });
  });

  describe("カスタム最大値", () => {
    context("maxが指定された場合", () => {
      it("正しいパーセンテージが計算されること", () => {
        render(<ProgressBar value={5} max={10} />);

        const fill = screen.getByTestId("progress-bar-fill");
        expect(fill).toHaveStyle({ width: "50%" });

        const progressbar = screen.getByRole("progressbar");
        expect(progressbar).toHaveAttribute("aria-valuemax", "10");
      });
    });
  });

  describe("ラベル表示", () => {
    context("ラベルが渡された場合", () => {
      it("ラベルが表示されること", () => {
        render(<ProgressBar value={50} label="週間目標達成率" />);

        expect(screen.getByTestId("progress-bar-label")).toHaveTextContent(
          "週間目標達成率"
        );
      });
    });

    context("サブラベルが渡された場合", () => {
      it("サブラベルが表示されること", () => {
        render(<ProgressBar value={75} subLabel="15/20記事" />);

        expect(screen.getByTestId("progress-bar-sublabel")).toHaveTextContent(
          "15/20記事"
        );
      });
    });

    context("両方のラベルが渡された場合", () => {
      it("両方のラベルが表示されること", () => {
        render(
          <ProgressBar value={75} label="週間目標" subLabel="15/20記事" />
        );

        expect(screen.getByTestId("progress-bar-label")).toBeInTheDocument();
        expect(screen.getByTestId("progress-bar-sublabel")).toBeInTheDocument();
      });
    });

    context("ラベルが渡されない場合", () => {
      it("ラベル行が表示されないこと", () => {
        render(<ProgressBar value={50} />);

        expect(
          screen.queryByTestId("progress-bar-label")
        ).not.toBeInTheDocument();
        expect(
          screen.queryByTestId("progress-bar-sublabel")
        ).not.toBeInTheDocument();
      });
    });
  });

  describe("サイズ", () => {
    context("smサイズの場合", () => {
      it("h-1.5クラスが適用されること", () => {
        render(<ProgressBar value={50} size="sm" />);

        const fill = screen.getByTestId("progress-bar-fill");
        expect(fill).toHaveClass("h-1.5");
      });
    });

    context("mdサイズの場合", () => {
      it("h-2クラスが適用されること", () => {
        render(<ProgressBar value={50} size="md" />);

        const fill = screen.getByTestId("progress-bar-fill");
        expect(fill).toHaveClass("h-2");
      });
    });

    context("lgサイズの場合", () => {
      it("h-3クラスが適用されること", () => {
        render(<ProgressBar value={50} size="lg" />);

        const fill = screen.getByTestId("progress-bar-fill");
        expect(fill).toHaveClass("h-3");
      });
    });
  });
});
