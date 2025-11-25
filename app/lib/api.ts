import { Article } from "@/app/types/types";
import { ExternalArticle } from "@/app/lib/fetchers/types";

/**
 * ExternalArticleをArticle型に変換
 */
export function convertToArticle(external: ExternalArticle): Article {
  return {
    id: external.id,
    title: external.title,
    description: external.description,
    url: external.url,
    publishedAt: external.publishedAt,
    source: external.source,
    author: external.author,
    tags: external.tags,
    imageUrl: external.imageUrl,
    isFavorite: false, //  デフォルトはお気に入りなし
  };
}

/**
 * APIから記事を取得（Server Component用）
 */
export async function fetchArticlesFromAPI(
  source: string = "qiita",
  tag?: string,
  limit: number = 20
): Promise<Article[]> {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";
    const params = new URLSearchParams({
      source,
      limit: limit.toString(),
    });

    if (tag) {
      params.append("tag", tag);
    }

    const url = `${baseUrl}/api/articles?${params.toString()}`;
    console.log(`Fetching articles from: ${url}`);

    const response = await fetch(url, {
      next: { revalidate: 30 }, // 30秒ごとに再検証
    });

    if (!response.ok) {
      throw new Error(`API returned ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();

    if (!data.articles || !Array.isArray(data.articles)) {
      throw new Error("Invalid API response format");
    }

    // ExternalArticle[] を Article[] に変換
    return data.articles.map(convertToArticle);
  } catch (error) {
    console.error("Error fetching articles from API:", error);
    // エラー時は空配列を返す（フォールバック）
    return [];
  }
}
