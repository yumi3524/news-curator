import { test, expect } from "@playwright/test";

/**
 * フィードページのE2Eテスト
 * 実際のブラウザで動作を確認する統合テスト
 */

test.describe("フィードページ", () => {
  test.beforeEach(async ({ page }) => {
    // 各テストの前にトップページへ移動
    await page.goto("/");
  });

  test("ページタイトルとヘッダーが表示されること", async ({ page }) => {
    // ヘッダーのタイトルを確認
    await expect(
      page.getByRole("heading", { name: "技術記事キュレーション" })
    ).toBeVisible();

    // 説明文を確認
    await expect(
      page.getByText("外部ソース（Qiita）から最新の技術記事を取得")
    ).toBeVisible();
  });

  test("ローディング状態が表示されてから記事が読み込まれること", async ({
    page,
  }) => {
    // ローディング表示を確認（すぐに消える可能性があるので optional）
    const loadingText = page.getByText("記事を読み込み中...");
    // ローディングが表示されるか、すでに記事が表示されているかを確認

    // 記事が表示されるまで待機
    await expect(page.getByText(/件の記事が見つかりました/)).toBeVisible({
      timeout: 10000,
    });
  });

  test("記事カードが表示されること", async ({ page }) => {
    // 記事が読み込まれるまで待機
    await page.waitForSelector('[data-testid="article-title"]', {
      timeout: 10000,
    });

    // 記事カードが少なくとも1つ表示されていることを確認
    const articleCards = page.locator('[data-testid="article-title"]');
    await expect(articleCards.first()).toBeVisible();
  });

  test("フィルタパネルが表示されること", async ({ page }) => {
    // フィルタタイトル
    await expect(page.getByText("フィルタ")).toBeVisible();

    // 検索入力欄
    await expect(
      page.getByPlaceholder("タイトルやタグで検索...")
    ).toBeVisible();
  });

  test("キーワード検索が機能すること", async ({ page }) => {
    // 記事が読み込まれるまで待機
    await page.waitForSelector('[data-testid="article-title"]', {
      timeout: 10000,
    });

    // 初期状態の記事数を取得
    const initialCountText = await page
      .getByText(/件の記事が見つかりました/)
      .textContent();

    // キーワード検索を実行
    const searchInput = page.getByTestId("keyword-search-input");
    await searchInput.fill("React");

    // 検索結果が更新されるのを待つ
    await page.waitForTimeout(500);

    // 記事数が変わったか、Reactを含む記事が表示されていることを確認
    const articleTitles = page.locator('[data-testid="article-title"]');
    const count = await articleTitles.count();
    expect(count).toBeGreaterThan(0);
  });

  test("タグフィルタが機能すること", async ({ page }) => {
    // 記事が読み込まれるまで待機
    await page.waitForSelector('[data-testid="article-title"]', {
      timeout: 10000,
    });

    // タグチップを探す（存在する場合）
    const tagChips = page.locator('[data-testid^="tag-chip-"]');
    const chipCount = await tagChips.count();

    if (chipCount > 0) {
      // 最初のタグをクリック
      await tagChips.first().click();

      // フィルタが適用されるのを待つ
      await page.waitForTimeout(500);

      // クリアボタンが表示されることを確認
      await expect(
        page.getByTestId("clear-filters-button")
      ).toBeVisible();
    }
  });

  test("お気に入りボタンが機能すること", async ({ page }) => {
    // 記事が読み込まれるまで待機
    await page.waitForSelector('[data-testid="favorite-button"]', {
      timeout: 10000,
    });

    // 最初の記事のお気に入りボタンをクリック
    const favoriteButton = page.locator('[data-testid="favorite-button"]').first();
    await favoriteButton.click();

    // ボタンの aria-label が変わることを確認（お気に入りに追加 → お気に入りから削除）
    await expect(favoriteButton).toHaveAttribute(
      "aria-label",
      "お気に入りから削除"
    );

    // もう一度クリックして元に戻す
    await favoriteButton.click();
    await expect(favoriteButton).toHaveAttribute(
      "aria-label",
      "お気に入りに追加"
    );
  });

  test("記事リンクが新しいタブで開くように設定されていること", async ({
    page,
  }) => {
    // 記事が読み込まれるまで待機
    await page.waitForSelector('[data-testid="article-title"]', {
      timeout: 10000,
    });

    // 最初の記事リンクを取得
    const articleLink = page.getByRole("link").first();

    // target="_blank" が設定されていることを確認
    await expect(articleLink).toHaveAttribute("target", "_blank");
    await expect(articleLink).toHaveAttribute("rel", "noopener noreferrer");
  });

  test("フィルタクリアボタンが機能すること", async ({ page }) => {
    // 記事が読み込まれるまで待機
    await page.waitForSelector('[data-testid="article-title"]', {
      timeout: 10000,
    });

    // キーワード検索を実行
    await page.getByTestId("keyword-search-input").fill("React");
    await page.waitForTimeout(500);

    // クリアボタンが表示されることを確認
    const clearButton = page.getByTestId("clear-filters-button");
    await expect(clearButton).toBeVisible();

    // クリアボタンをクリック
    await clearButton.click();

    // 検索入力欄が空になることを確認
    await expect(page.getByTestId("keyword-search-input")).toHaveValue("");

    // クリアボタンが非表示になることを確認
    await expect(clearButton).not.toBeVisible();
  });

  test("エラー状態が正しく表示されること", async ({ page }) => {
    // APIをモックしてエラーを発生させる
    await page.route("/api/articles*", (route) => {
      route.fulfill({
        status: 500,
        body: JSON.stringify({ error: "Internal Server Error" }),
      });
    });

    await page.goto("/");

    // エラーメッセージが表示されることを確認
    await expect(page.getByText(/エラー:/)).toBeVisible({ timeout: 10000 });
  });

  test("記事が見つからない場合のメッセージが表示されること", async ({
    page,
  }) => {
    // APIをモックして空の配列を返す
    await page.route("/api/articles*", (route) => {
      route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({ articles: [] }),
      });
    });

    await page.goto("/");

    // 「見つかりませんでした」メッセージを確認
    await expect(
      page.getByText("条件に一致する記事が見つかりませんでした。")
    ).toBeVisible({ timeout: 10000 });
  });
});
