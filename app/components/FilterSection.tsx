'use client';

import { Search, ChevronDown, ChevronUp, Filter } from 'lucide-react';
import { useState } from 'react';

interface TagCount {
  name: string;
  count: number;
}

interface FilterSectionProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  sources: TagCount[];
  selectedSources: Set<string>;
  onSourceToggle: (source: string) => void;
  tags: TagCount[];
  selectedTags: Set<string>;
  onTagToggle: (tag: string) => void;
  filterMode: 'OR' | 'AND';
  onFilterModeChange: (mode: 'OR' | 'AND') => void;
  activeFilters: Array<{ type: 'search' | 'source' | 'tag'; value: string }>;
  onRemoveFilter: (type: string, value: string) => void;
}

export function FilterSection({
  searchQuery,
  onSearchChange,
  sources,
  selectedSources,
  onSourceToggle,
  tags,
  selectedTags,
  onTagToggle,
  filterMode,
  onFilterModeChange,
  activeFilters,
  onRemoveFilter,
}: FilterSectionProps) {
  const [isTagsExpanded, setIsTagsExpanded] = useState(false);
  const [isSourcesExpanded, setIsSourcesExpanded] = useState(false);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const displayedTags = isTagsExpanded ? tags : tags.slice(0, 10);

  return (
    <section className="mb-8 animate-[fadeIn_0.5s_ease-out_0.1s_both] rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-secondary)] p-4 shadow-[0_1px_3px_rgba(0,0,0,0.05)] md:p-6">
      {/* Search */}
      <div className="mb-4 flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-[var(--color-text-tertiary)]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="キーワードで検索..."
            className="w-full rounded-lg border-[1.5px] border-[var(--color-border)] bg-[var(--color-bg-primary)] px-4 py-3 pl-11 text-base text-[var(--color-text-primary)] transition-all duration-200 placeholder:text-[var(--color-text-tertiary)] focus:border-[var(--color-brand-primary)] focus:bg-[var(--color-bg-secondary)] focus:shadow-[0_0_0_3px_rgba(245,158,11,0.1)] focus:outline-none"
          />
        </div>
      </div>

      {/* Mobile Filter Toggle */}
      <button
        onClick={() => setIsMobileFilterOpen(!isMobileFilterOpen)}
        className="mb-4 flex w-full items-center justify-center gap-2 rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-primary)] py-3 text-sm font-semibold text-[var(--color-text-secondary)] transition-colors hover:bg-[var(--color-bg-tertiary)] md:hidden"
      >
        <Filter className="h-4 w-4" />
        <span>詳細フィルター {activeFilters.length > 0 && `(${activeFilters.length})`}</span>
        {isMobileFilterOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
      </button>

      <div className={`${isMobileFilterOpen ? 'block' : 'hidden'} md:block`}>

        {/* Tags */}
        <div className="mb-4 flex gap-4">
          <div className="flex-1 min-w-0">
            <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-[var(--color-text-secondary)]">
              <span>タグで絞り込み</span>
              <div className="ml-auto inline-flex rounded-md bg-[var(--color-bg-tertiary)] p-0.5">
                <button
                  onClick={() => onFilterModeChange('OR')}
                  className={`rounded px-3 py-1 text-xs font-semibold transition-all duration-200 ${filterMode === 'OR'
                    ? 'bg-[var(--color-brand-primary)] text-[var(--color-text-on-accent)]'
                    : 'bg-transparent text-[var(--color-text-secondary)]'
                    }`}
                >
                  OR
                </button>
                <button
                  onClick={() => onFilterModeChange('AND')}
                  className={`rounded px-3 py-1 text-xs font-semibold transition-all duration-200 ${filterMode === 'AND'
                    ? 'bg-[var(--color-brand-primary)] text-[var(--color-text-on-accent)]'
                    : 'bg-transparent text-[var(--color-text-secondary)]'
                    }`}
                >
                  AND
                </button>
              </div>
            </div>
            {/* タグコンテナ - 折り返し可能、最大高さ制限付き */}
            <div className="flex flex-wrap gap-2 max-h-[250px] overflow-y-auto scrollbar-hide">
              {displayedTags.map((tag) => (
                <button
                  key={tag.name}
                  onClick={() => onTagToggle(tag.name)}
                  className={`flex items-center gap-2 rounded-md border-[1.5px] px-4 py-2 text-sm font-medium transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_2px_8px_rgba(0,0,0,0.06)] ${selectedTags.has(tag.name)
                    ? 'border-[var(--color-brand-primary)] bg-[var(--color-brand-primary)] font-semibold text-[var(--color-text-on-accent)] shadow-[0_2px_8px_rgba(245,158,11,0.3)]'
                    : 'border-[var(--color-border)] bg-[var(--color-bg-secondary)] text-[var(--color-text-primary)] hover:border-[var(--color-brand-primary)]'
                    }`}
                >
                  <span>{tag.name}</span>
                  <span className={`rounded-[10px] px-2 py-0.5 text-xs font-semibold ${selectedTags.has(tag.name)
                    ? 'bg-white/25'
                    : 'bg-black/[0.08] dark:bg-white/[0.10]'
                    }`}>
                    {tag.count}
                  </span>
                </button>
              ))}
            </div>
            {tags.length > 10 && (
              <button
                onClick={() => setIsTagsExpanded(!isTagsExpanded)}
                className="mt-3 flex items-center gap-1 text-sm font-medium text-[var(--color-brand-primary)] transition-colors hover:text-[var(--color-accent-dark)]"
              >
                {isTagsExpanded ? (
                  <>
                    <ChevronUp className="h-4 w-4" />
                    <span>閉じる</span>
                  </>
                ) : (
                  <>
                    <ChevronDown className="h-4 w-4" />
                    <span>さらに表示 ({tags.length - 10}件)</span>
                  </>
                )}
              </button>
            )}
          </div>
        </div>

        {/* Sources */}
        <div className="mb-0 flex gap-4">
          <div className="flex-1">
            <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-[var(--color-text-secondary)]">
              <button
                onClick={() => setIsSourcesExpanded(!isSourcesExpanded)}
                className="flex items-center gap-1 transition-colors hover:text-[var(--color-text-primary)]"
              >
                <span>ソースで絞り込み</span>
                {isSourcesExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
              </button>
              {selectedSources.size > 0 && (
                <span className="rounded-full bg-[var(--color-brand-primary)] px-2 py-0.5 text-xs font-bold text-[var(--color-text-on-accent)]">
                  {selectedSources.size}
                </span>
              )}
            </div>
            {isSourcesExpanded && (
              <div className="flex flex-wrap gap-2 animate-[slideIn_0.2s_ease-out]">
                {sources.map((source) => (
                  <button
                    key={source.name}
                    onClick={() => onSourceToggle(source.name)}
                    className={`flex items-center gap-2 rounded-md border-[1.5px] px-4 py-2 text-sm font-medium transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_2px_8px_rgba(0,0,0,0.06)] ${selectedSources.has(source.name)
                      ? 'border-[var(--color-brand-primary)] bg-[var(--color-brand-primary)] font-semibold text-[var(--color-text-on-accent)] shadow-[0_2px_8px_rgba(245,158,11,0.3)]'
                      : 'border-[var(--color-border)] bg-[var(--color-bg-secondary)] text-[var(--color-text-primary)] hover:border-[var(--color-brand-primary)]'
                      }`}
                  >
                    <span>{source.name}</span>
                    <span className={`rounded-[10px] px-2 py-0.5 text-xs font-semibold ${selectedSources.has(source.name)
                      ? 'bg-white/25'
                      : 'bg-black/[0.08] dark:bg-white/[0.10]'
                      }`}>
                      {source.count}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Active Filters */}
      {activeFilters.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-2 border-t border-[var(--color-border)] pt-4 animate-[slideIn_0.2s_ease-out]">
          {activeFilters.map((filter, index) => (
            <div
              key={`${filter.type}-${filter.value}-${index}`}
              className="flex items-center gap-2 rounded-md bg-[var(--color-brand-accent)] px-3 py-1.5 text-[13px] font-semibold text-[var(--color-text-on-accent)] shadow-[0_2px_4px_rgba(245,158,11,0.3)]"
            >
              <span>{filter.value}</span>
              <button
                onClick={() => onRemoveFilter(filter.type, filter.value)}
                className="text-lg leading-none opacity-70 transition-opacity duration-200 hover:opacity-100"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
