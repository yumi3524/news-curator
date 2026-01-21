import type { FilterOptions } from "@/app/types/types";

/**
 * FilterPanelのProps
 */
interface FilterPanelProps {
  /** 利用可能なソースのリスト */
  availableSources: Array<{ id: string; name: string }>;
  /** 利用可能なタグのリスト */
  availableTags: string[];
  /** 現在のフィルタ状態 */
  filters: FilterOptions;
  /** フィルタ変更時のコールバック */
  onFiltersChange: (filters: FilterOptions) => void;
}

/**
 * フィルタパネルコンポーネント
 *
 * ソース、タグ、キーワードによる記事フィルタリング機能を提供します。
 */
export default function FilterPanel({
  availableSources,
  availableTags,
  filters,
  onFiltersChange,
}: FilterPanelProps) {
  /**
   * ソース選択の切り替え
   */
  const handleSourceToggle = (sourceId: string) => {
    const newSelectedSources = filters.selectedSources.includes(sourceId)
      ? filters.selectedSources.filter((id) => id !== sourceId)
      : [...filters.selectedSources, sourceId];

    onFiltersChange({
      ...filters,
      selectedSources: newSelectedSources,
    });
  };

  /**
   * タグ選択の切り替え
   */
  const handleTagToggle = (tag: string) => {
    const newSelectedTags = filters.selectedTags.includes(tag)
      ? filters.selectedTags.filter((t) => t !== tag)
      : [...filters.selectedTags, tag];

    onFiltersChange({
      ...filters,
      selectedTags: newSelectedTags,
    });
  };

  /**
   * キーワード検索の変更
   */
  const handleKeywordChange = (keyword: string) => {
    onFiltersChange({
      ...filters,
      searchKeyword: keyword,
    });
  };

  /**
   * すべてのフィルタをクリア
   */
  const handleClearAll = () => {
    onFiltersChange({
      selectedSources: [],
      selectedTags: [],
      searchKeyword: "",
    });
  };

  // アクティブなフィルタの数
  const activeFiltersCount =
    filters.selectedSources.length +
    filters.selectedTags.length +
    (filters.searchKeyword.trim() ? 1 : 0);

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-6">
      {/* ヘッダー */}
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-lg font-bold text-gray-900">フィルタ</h2>
        {activeFiltersCount > 0 && (
          <button
            onClick={handleClearAll}
            className="text-sm text-blue-600 hover:text-blue-700 hover:underline"
            data-testid="clear-filters-button"
          >
            すべてクリア ({activeFiltersCount})
          </button>
        )}
      </div>

      <div className="space-y-6">
        {/* キーワード検索 */}
        <div>
          <label
            htmlFor="keyword-search"
            className="mb-2 block text-sm font-medium text-gray-700"
          >
            キーワード検索
          </label>
          <input
            id="keyword-search"
            type="text"
            value={filters.searchKeyword}
            onChange={(e) => handleKeywordChange(e.target.value)}
            placeholder="タイトルやタグで検索..."
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            data-testid="keyword-search-input"
          />
        </div>

        {/* ソースフィルタ */}
        <div>
          <h3 className="mb-3 text-sm font-medium text-gray-700">
            ソースで絞り込み
          </h3>
          <div className="space-y-2">
            {availableSources.map((source) => (
              <label
                key={source.id}
                className="flex cursor-pointer items-center hover:bg-gray-50 rounded px-2 py-1 -ml-2"
              >
                <input
                  type="checkbox"
                  checked={filters.selectedSources.includes(source.id)}
                  onChange={() => handleSourceToggle(source.id)}
                  className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                  data-testid={`source-checkbox-${source.id}`}
                />
                <span className="ml-2 text-sm text-gray-700">{source.name}</span>
              </label>
            ))}
          </div>
        </div>

        {/* タグフィルタ */}
        <div>
          <h3 className="mb-3 text-sm font-medium text-gray-700">
            タグで絞り込み
          </h3>
          <div className="flex flex-wrap gap-2">
            {availableTags.map((tag) => {
              const isSelected = filters.selectedTags.includes(tag);
              return (
                <button
                  key={tag}
                  onClick={() => handleTagToggle(tag)}
                  className={`rounded-full px-3 py-1 text-sm font-medium transition-colors ${
                    isSelected
                      ? "bg-blue-600 text-white hover:bg-blue-700"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                  data-testid={`tag-chip-${tag}`}
                >
                  {tag}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
