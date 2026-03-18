import { NextResponse } from "next/server";
import {
  getArticles,
  getStaleArticles,
  type ArticleQueryParams,
} from "@/app/lib/services/articleService";

type SourceType = "qiita" | "hackernews";

function parseQueryParams(searchParams: URLSearchParams): ArticleQueryParams {
  const tagsParam = searchParams.get("tags");
  const singleTag = searchParams.get("tag") || undefined;
  const tags = tagsParam
    ? tagsParam.split(",").map((t) => t.trim())
    : singleTag
      ? [singleTag]
      : undefined;

  const sourcesParam = searchParams.get("sources");
  const sources: SourceType[] = sourcesParam
    ? (sourcesParam.split(",").map((s) => s.trim()) as SourceType[])
    : ["qiita", "hackernews"];

  const limitParam = searchParams.get("limit");
  const limit = limitParam ? parseInt(limitParam, 10) : 20;

  const forceRefresh = searchParams.get("refresh") === "true";

  return { tags, sources, limit, forceRefresh };
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const params = parseQueryParams(searchParams);

  try {
    const result = await getArticles(params);
    return NextResponse.json(result);
  } catch (error) {
    console.error("Error in /api/articles:", error);

    const staleResult = await getStaleArticles(params);
    if (staleResult) {
      return NextResponse.json(staleResult);
    }

    return NextResponse.json(
      {
        error: "Failed to fetch articles",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

export const revalidate = 3600;
