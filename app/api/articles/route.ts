import { NextResponse } from "next/server";
import { QiitaAPIFetcher } from "@/app/lib/fetchers/qiita-api";
import { FetchOptions } from "@/app/lib/fetchers/types";

/**
 * 外部ソースから記事を取得するAPI
 *
 * GET /api/articles?source=qiita&tag=React&limit=50&days=7&sortBy=likes
 * GET /api/articles?tags=React,Next.js,TypeScript  (パーソナルサーチ用)
 *
 * クエリパラメータ:
 * - source: ソース名（現在は "qiita" のみサポート）
 * - tag: フィルタリングするタグ（オプション）
 * - tags: 複数タグ（カンマ区切り）でOR検索（パーソナルサーチ用）
 * - limit: 取得する記事数（デフォルト: 30）
 * - days: 過去N日間の記事を取得（オプション、デフォルト: 7日）
 * - sortBy: ソート順 created|likes|stocks（オプション、デフォルト: likes）
 */
import { DEFAULT_DAYS_AGO, DEFAULT_FETCH_LIMIT } from "@/app/lib/constants";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const source = searchParams.get("source") || "qiita";
  const tag = searchParams.get("tag") || undefined;
  const tagsParam = searchParams.get("tags"); // パーソナルサーチ用
  const tags = tagsParam ? tagsParam.split(',').map(t => t.trim()) : undefined;
  const limitParam = searchParams.get("limit");
  const limit = limitParam ? parseInt(limitParam, 10) : DEFAULT_FETCH_LIMIT;
  const daysParam = searchParams.get("days");
  const days = daysParam ? parseInt(daysParam, 10) : DEFAULT_DAYS_AGO;
  const sortBy = (searchParams.get("sortBy") as FetchOptions['sortBy']) || 'likes';

  try {
    let articles = [];

    switch (source) {
      case "qiita": {
        const qiitaFetcher = new QiitaAPIFetcher();
        // tagsがtagより優先（パーソナルサーチの場合）
        articles = await qiitaFetcher.fetch({ tags, tag, limit, days, sortBy });
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
// 300秒（5分）ごとに再検証（revalidate）
// Qiita API のレート制限（60回/時）を考慮して設定
// Note: 定数ファイル (CACHE_REVALIDATE_SECONDS) と同じ値を使用していますが、
// ビルドエラー回避のためリテラル値を直接設定しています。
export const revalidate = 300;
