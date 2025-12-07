import { NextResponse } from "next/server";
import { QiitaAPIFetcher } from "@/app/lib/fetchers/qiita-api";

/**
 * 外部ソースから記事を取得するAPI
 *
 * GET /api/articles?source=qiita&tag=React&limit=50
 *
 * クエリパラメータ:
 * - source: ソース名（現在は "qiita" のみサポート）
 * - tag: フィルタリングするタグ（オプション）
 * - limit: 取得する記事数（デフォルト: 20）
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const source = searchParams.get("source") || "qiita";
  const tag = searchParams.get("tag") || undefined;
  const limitParam = searchParams.get("limit");
  const limit = limitParam ? parseInt(limitParam, 10) : 30;

  try {
    let articles = [];

    switch (source) {
      case "qiita": {
        const qiitaFetcher = new QiitaAPIFetcher();
        articles = await qiitaFetcher.fetch({ tag, limit });
        break;
      }
      default:
        return NextResponse.json(
          { error: `Invalid source: ${source}. Currently only 'qiita' is supported.` },
          { status: 400 }
        );
    }

    return NextResponse.json({
      articles,
      source,
      count: articles.length,
    });
  } catch (error) {
    console.error("Error in /api/articles:", error);
    return NextResponse.json(
      {
        error: "Failed to fetch articles",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

// Next.js App Routerのキャッシング設定
// 30秒ごとに再検証（revalidate）
export const revalidate = 30;
