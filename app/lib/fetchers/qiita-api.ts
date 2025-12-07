import { ArticleFetcher, ExternalArticle, FetchOptions, QiitaItem, QiitaTag, QiitaUser } from "./types";

/**
 * Qiita API v2 フェッチャー
 * @see docs/QIITA_API.md
 */
export class QiitaAPIFetcher implements ArticleFetcher {
  private readonly baseUrl = "https://qiita.com/api/v2";

  /**
   * 記事を取得
   */
  async fetch(options?: FetchOptions): Promise<ExternalArticle[]> {
    try {
      // クエリパラメータの構築
      const params = new URLSearchParams();
      params.append("page", "1");
      params.append("per_page", String(options?.limit || 20));
      
      if (options?.tag) {
        // タグ指定がある場合は query パラメータを使用
        params.append("query", `tag:${options.tag}`);
      }

      const url = `${this.baseUrl}/items?${params.toString()}`;
      console.log(`Qiita API から取得: ${url}`);

      const response = await fetch(url, {
        method: "GET",
        headers: {
          // 公開APIとして利用（認証トークンなしでも制限付きで利用可能）
          "Content-Type": "application/json",
        },
        next: {
          // Next.js のキャッシュ設定（レート制限対策）
          revalidate: 300, // 5分間キャッシュ
        },
      });

      if (!response.ok) {
        throw new Error(`Qiita API エラー: ${response.status} ${response.statusText}`);
      }

      const items: QiitaItem[] = await response.json();

      if (!Array.isArray(items)) {
        throw new Error("Qiita API のレスポンスが不正です: 配列ではありません");
      }

      // APIレスポンスをExternalArticle形式に変換
      return items.map((item) => ({
        id: item.id,
        title: item.title,
        description: item.body ? this.stripMarkdown(item.body).substring(0, 200) + "..." : "",
        url: item.url,
        publishedAt: item.created_at,
        source: {
          id: "qiita",
          name: "Qiita",
        },
        author: item.user?.id || "Unknown",
        // Qiita APIはタグオブジェクトの配列を返す [{name: "React", ...}, ...]
        tags: item.tags.map((t) => t.name),
        imageUrl: item.user?.profile_image_url,
        likesCount: item.likes_count,
        stocksCount: item.stocks_count,
      }));

    } catch (error) {
      console.error("Qiita API からの取得中にエラーが発生しました:", error);
      // エラー時は空配列を返すか、再スローするか検討が必要だが、
      // ここでは呼び出し元でハンドリングさせるためにスローする
      throw error;
    }
  }

  /**
   * Markdownからプレーンテキストを抽出（簡易版）
   * 記事の概要文生成に使用
   */
  private stripMarkdown(markdown: string): string {
    return markdown
      // ヘッダーを除去
      .replace(/^#+\s+/gm, "")
      // リンクを除去 [text](url) -> text
      .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
      // 画像を除去 ![alt](url) -> ""
      .replace(/!\[[^\]]*\]\([^)]+\)/g, "")
      // コードブロックを除去
      .replace(/```[\s\S]*?```/g, "")
      // インラインコードを除去
      .replace(/`([^`]+)`/g, "$1")
      // HTMLタグを除去
      .replace(/<[^>]*>/g, "")
      // 空行を削除
      .replace(/\n\s*\n/g, "\n")
      .trim();
  }
}
