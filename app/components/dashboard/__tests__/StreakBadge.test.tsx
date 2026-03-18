import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { StreakBadge } from "../StreakBadge";

const context = describe;

describe("StreakBadge", () => {
  describe("基本表示", () => {
    context("必須プロパティのみ渡された場合", () => {
      it("バッジが表示されること", () => {
        render(<StreakBadge days={7} />);

        expect(screen.getByTestId("streak-badge")).toBeInTheDocument();
      });

      it("日数が正しく表示されること", () => {
        render(<StreakBadge days={7} />);

        expect(screen.getByTestId("streak-badge-days")).toHaveTextContent(
          "7日連続"
        );
      });

      it("炎アイコンが表示されること", () => {
        render(<StreakBadge days={7} />);

        expect(screen.getByTestId("streak-badge-icon")).toBeInTheDocument();
      });

      it("最長記録ラベルが表示されないこと", () => {
        render(<StreakBadge days={7} />);

        expect(
          screen.queryByTestId("streak-badge-record")
        ).not.toBeInTheDocument();
      });
    });
  });

  describe("日数表示", () => {
    context("様々な日数の場合", () => {
      it("1日が表示されること", () => {
        render(<StreakBadge days={1} />);

        expect(screen.getByTestId("streak-badge-days")).toHaveTextContent(
          "1日連続"
        );
      });

      it("30日が表示されること", () => {
        render(<StreakBadge days={30} />);

        expect(screen.getByTestId("streak-badge-days")).toHaveTextContent(
          "30日連続"
        );
      });

      it("100日が表示されること", () => {
        render(<StreakBadge days={100} />);

        expect(screen.getByTestId("streak-badge-days")).toHaveTextContent(
          "100日連続"
        );
      });
    });
  });

  describe("最長記録", () => {
    context("isRecordがtrueの場合", () => {
      it("最長記録ラベルが表示されること", () => {
        render(<StreakBadge days={21} isRecord={true} />);

        expect(screen.getByTestId("streak-badge-record")).toHaveTextContent(
          "最長"
        );
      });

      it("アイコンにanimate-pulseクラスが適用されること", () => {
        render(<StreakBadge days={21} isRecord={true} />);

        expect(screen.getByTestId("streak-badge-icon")).toHaveClass(
          "animate-pulse"
        );
      });
    });

    context("isRecordがfalseの場合", () => {
      it("最長記録ラベルが表示されないこと", () => {
        render(<StreakBadge days={21} isRecord={false} />);

        expect(
          screen.queryByTestId("streak-badge-record")
        ).not.toBeInTheDocument();
      });

      it("アイコンにanimate-pulseクラスが適用されないこと", () => {
        render(<StreakBadge days={21} isRecord={false} />);

        expect(screen.getByTestId("streak-badge-icon")).not.toHaveClass(
          "animate-pulse"
        );
      });
    });
  });

  describe("サイズ", () => {
    context("smサイズの場合", () => {
      it("text-[11px]クラスが適用されること", () => {
        render(<StreakBadge days={7} size="sm" />);

        expect(screen.getByTestId("streak-badge")).toHaveClass("text-[11px]");
      });
    });

    context("mdサイズの場合", () => {
      it("text-[13px]クラスが適用されること", () => {
        render(<StreakBadge days={7} size="md" />);

        expect(screen.getByTestId("streak-badge")).toHaveClass("text-[13px]");
      });
    });

    context("lgサイズの場合", () => {
      it("text-[15px]クラスが適用されること", () => {
        render(<StreakBadge days={7} size="lg" />);

        expect(screen.getByTestId("streak-badge")).toHaveClass("text-[15px]");
      });
    });
  });
});
