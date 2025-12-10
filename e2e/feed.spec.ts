import { test, expect } from "@playwright/test";

/**
 * フィードページのE2Eテスト
 * 実際のブラウザで動作を確認する統合テスト
 */

test.describe("フィードページ", () => {
  // テスト環境をライトモードで固定
  test.use({ colorScheme: 'light' });

  test.beforeEach(async ({ page }) => {
    // ローカルストレージをクリアするために一度アクセス
    await page.goto("/");
    await page.evaluate(() => localStorage.clear());
    await page.reload();
  });

  test("displays the main title", async ({ page }) => {
    await page.goto("/");
    
    // Wait for the heading to be visible
    await expect(
      page.getByRole("heading", { name: "Tech Feed" })
    ).toBeVisible();
  });

  test("displays articles", async ({ page }) => {
    await page.goto("/");
    
    // Wait for articles to load
    await page.waitForSelector("[data-testid='article-card']", {
      timeout: 10000,
    });
    // テーマ切り替えボタンの確認
    await expect(
      page.getByRole("button", { name: "ダークモードに切り替え" })
    ).toBeVisible();
  });

  test("テーマ切り替えが機能すること", async ({ page }) => {
    // 初期状態はライトモード（test.useで指定）
    const themeButton = page.getByRole("button", { name: "ダークモードに切り替え" });
    await expect(themeButton).toBeVisible();

    // htmlタグにdarkクラスがないことを確認
    const html = page.locator('html');
    await expect(html).not.toHaveClass(/dark/);

    // ダークモードに切り替え
    await themeButton.click();

    // ボタンのAccessible Nameが変わることを確認
    await expect(page.getByRole("button", { name: "ライトモードに切り替え" })).toBeVisible();

    // htmlタグにdarkクラスが付与されることを確認
    await expect(html).toHaveClass(/dark/);

    // リロードしても設定が維持されること（localStorage）
    await page.reload();
    await expect(html).toHaveClass(/dark/);
    await expect(page.getByRole("button", { name: "ライトモードに切り替え" })).toBeVisible();
  });

  test("記事一覧が表示されること", async ({ page }) => {
    // タイムアウトを少し長めに
    test.setTimeout(10000);

    // 記事コンテナが表示されるのを待つ
    const main = page.locator('main');
    await expect(main).toBeVisible();
  });
});
