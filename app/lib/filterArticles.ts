import { Article } from "@/app/types/types";

/**
 * フィルタ条件の型定義
 */
export interface FilterOptions {
  /** 選択されたソースID（複数選択可能） */
  selectedSources: string[];
  /** 選択されたタグ（複数選択可能） */
  selectedTags: string[];
  /** キーワード検索文字列 */
  searchKeyword: string;
}

/**
 * 記事をフィルタリングする関数
 *
 * フィルタ条件:
 * 1. ソースフィルタ: 選択されたソースIDのいずれかに一致する記事
 * 2. タグフィルタ: 選択されたタグをすべて含む記事
 * 3. キーワード検索: タイトルまたはタグに検索キーワードを含む記事
 *
 * すべての条件はAND条件で適用される
 *
 * @param articles - フィルタリング対象の記事配列
 * @param options - フィルタ条件
 * @returns フィルタリングされた記事配列
 */
export function filterArticles(
  articles: Article[],
  options: FilterOptions
): Article[] {
  const { selectedSources, selectedTags, searchKeyword } = options;

  return articles.filter((article) => {
    // ソースフィルタ: 選択されたソースがある場合、そのいずれかに一致する必要がある
    if (selectedSources.length > 0) {
      if (!selectedSources.includes(article.source.id)) {
        return false;
      }
    }

    // タグフィルタ: 選択されたタグすべてを含む必要がある
    if (selectedTags.length > 0) {
      const hasAllTags = selectedTags.every((tag) =>
        article.tags.includes(tag)
      );
      if (!hasAllTags) {
        return false;
      }
    }

    // キーワード検索: タイトルまたはタグに含まれる必要がある
    if (searchKeyword.trim() !== "") {
      const keyword = searchKeyword.toLowerCase();
      const titleMatch = article.title.toLowerCase().includes(keyword);
      const tagsMatch = article.tags.some((tag) =>
        tag.toLowerCase().includes(keyword)
      );

      if (!titleMatch && !tagsMatch) {
        return false;
      }
    }

    return true;
  });
}

/**
 * 記事配列から一意なソースのリストを抽出する
 *
 * @param articles - 記事配列
 * @returns 一意なソースの配列（ID順にソート）
 */
export function extractUniqueSources(
  articles: Article[]
): Array<{ id: string; name: string }> {
  const sourcesMap = new Map<string, string>();

  articles.forEach((article) => {
    if (!sourcesMap.has(article.source.id)) {
      sourcesMap.set(article.source.id, article.source.name);
    }
  });

  return Array.from(sourcesMap.entries())
    .map(([id, name]) => ({ id, name }))
    .sort((a, b) => a.id.localeCompare(b.id));
}

/**
 * 記事配列から一意なタグのリストを抽出する
 *
 * @param articles - 記事配列
 * @returns 一意なタグの配列（アルファベット順にソート）
 */
export function extractUniqueTags(articles: Article[]): string[] {
  const tagsSet = new Set<string>();

  articles.forEach((article) => {
    article.tags.forEach((tag) => {
      tagsSet.add(tag);
    });
  });

  return Array.from(tagsSet).sort((a, b) => a.localeCompare(b));
}
