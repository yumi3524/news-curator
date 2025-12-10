"use client";

import { Article } from "@/app/types/types";
import { useTagClickHandler } from "@/app/lib/hooks/useTagClickHandler";

/**
 * ArticleCardコンポーネントのProps
 */
interface ArticleCardProps {
  article: Article;
  onToggleFavorite: (articleId: string) => void;
  onTagClick?: (tag: string) => void;
}

/**
 * フィード用の記事カードコンポーネント
 * 
 * UIの意図:
 * - シンプルで読みやすいカードデザイン
 * - ホバー時に軽く浮き上がるエフェクトで、クリック可能であることを示す
 * - お気に入りボタンは右上に配置し、すぐにアクセスできるようにする
 * - タグはバッジ形式で視覚的に区別しやすくする
 * 
 * レスポンシブ対応の考え方:
 * - モバイル: 縦長のカードで情報を縦に配置（タイトル→メタ情報→タグ）
 * - タブレット以上: 余白を増やし、より快適な閲覧体験を提供
 * - タグは折り返しを許可し、多数のタグでもレイアウトが崩れないようにする
 * - テキストは適切な行数制限（line-clamp）で長文でも見やすく
 */
export default function ArticleCard({
  article,
  onToggleFavorite,
  onTagClick,
}: ArticleCardProps) {
  /**
   * 日付を日本語形式でフォーマット
   * ハイドレーションエラーを避けるため、サーバーとクライアントで同じ結果を返す方法を使用
   */
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    return `${year}年${month}月${day}日`;
  };

  /**
   * お気に入りボタンのクリックハンドラ
   * イベントの伝播を止めて、カード全体のクリックイベントと競合しないようにする
   */
  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onToggleFavorite(article.id);
  };

  const handleTagClick = useTagClickHandler(onTagClick);

  return (
    <article
      className="group relative flex flex-col overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
      data-testid="article-card"
    >
      {/* お気に入りボタン - 右上に固定配置 */}
      <button
        onClick={handleFavoriteClick}
        className="absolute right-3 top-3 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 backdrop-blur-sm transition-all duration-200 hover:scale-110 hover:bg-white"
        aria-label={
          article.isFavorite
            ? "お気に入りから削除"
            : "お気に入りに追加"
        }
        data-testid="favorite-button"
      >
        {article.isFavorite ? (
          // お気に入り済み - 塗りつぶしハート
          <svg
            className="h-5 w-5 text-red-500"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
              clipRule="evenodd"
            />
          </svg>
        ) : (
          // 未お気に入り - 枠線ハート
          <svg
            className="h-5 w-5 text-gray-400 transition-colors group-hover:text-gray-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
            />
          </svg>
        )}
      </button>

      {/* カードのメインコンテンツ - クリックで新しいタブで記事を開く */}
      <a
        href={article.url}
        target="_blank"
        rel="noopener noreferrer"
        className="flex flex-1 flex-col p-5 sm:p-6"
      >
        {/* タイトル - 最大2行で切り詰め */}
        <h3
          className="mb-3 line-clamp-2 text-lg font-bold text-gray-900 transition-colors group-hover:text-blue-600 sm:text-xl"
          data-testid="article-title"
        >
          {article.title}
        </h3>

        {/* メタ情報（ソース名と公開日） */}
        <div
          className="mb-4 flex flex-wrap items-center gap-2 text-sm text-gray-600"
          data-testid="article-meta"
        >
          <span className="font-medium text-gray-900">
            {article.source.name}
          </span>
          <span className="text-gray-400">•</span>
          <time dateTime={article.publishedAt}>
            {formatDate(article.publishedAt)}
          </time>

          {/* いいね数・ストック数 (Qiita APIの場合) */}
          {(article.likesCount !== undefined || article.stocksCount !== undefined) && (
            <>
              <span className="text-gray-400">•</span>
              <div className="flex gap-3">
                {article.likesCount !== undefined && (
                  <span className="flex items-center gap-1" title="いいね数">
                    <svg
                      className="h-4 w-4 text-gray-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5"
                      />
                    </svg>
                    <span>{article.likesCount}</span>
                  </span>
                )}
                {article.stocksCount !== undefined && (
                  <span className="flex items-center gap-1" title="ストック数">
                    <svg
                      className="h-4 w-4 text-gray-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
                      />
                    </svg>
                    <span>{article.stocksCount}</span>
                  </span>
                )}
              </div>
            </>
          )}
        </div>

        {/* タグバッジリスト - 折り返し可能 */}
        {article.tags.length > 0 && (
          <div
            className="mt-auto flex flex-wrap gap-2"
            data-testid="article-tags"
          >
            {article.tags.map((tag) => (
              <button
                key={tag}
                onClick={(e) => handleTagClick(e, tag)}
                className="rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700 transition-colors hover:bg-blue-100 hover:shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1"
                aria-label={`${tag}でフィルタリング`}
                type="button"
              >
                {tag}
              </button>
            ))}
          </div>
        )}

        {/* 外部リンクアイコン - ホバー時に表示 */}
        <div className="absolute bottom-4 right-4 opacity-0 transition-opacity group-hover:opacity-100">
          <svg
            className="h-5 w-5 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
            />
          </svg>
        </div>
      </a>
    </article>
  );
}
