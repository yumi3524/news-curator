'use client';

import { Search, ChevronDown, ChevronUp, Filter, UserCircle } from 'lucide-react';
import { useState } from 'react';
import { Tag } from './Tag';
import { Input } from './Input';

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
  onPersonalSearchClick: () => void; // パーソナルサーチボタンハンドラ
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
  onPersonalSearchClick,
}: FilterSectionProps) {
  const [isTagsExpanded, setIsTagsExpanded] = useState(false);
  const [isSourcesExpanded, setIsSourcesExpanded] = useState(false);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const displayedTags = isTagsExpanded ? tags : tags.slice(0, 10);

  return (
    <section className="mb-8 animate-[fadeIn_0.5s_ease-out_0.1s_both] rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-secondary)] p-4 shadow-[0_1px_3px_rgba(0,0,0,0.05)] md:p-6">
      {/* 検索バー */}
      <div className="mb-6">
        <Input
          type="text"
          placeholder="キーワードで検索..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          leftIcon={<Search className="h-4 w-4" />}
          fullWidth
        />
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
                <Tag
                  key={tag.name}
                  label={tag.name}
                  variant={selectedTags.has(tag.name) ? 'selected' : 'outline'}
                  size="md"
                  count={tag.count}
                  onClick={() => onTagToggle(tag.name)}
                  className="px-4 py-2 hover:-translate-y-0.5 hover:shadow-[0_2px_8px_rgba(0,0,0,0.06)]"
                />
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
                  <Tag
                    key={source.name}
                    label={source.name}
                    variant={selectedSources.has(source.name) ? 'selected' : 'outline'}
                    size="md"
                    count={source.count}
                    onClick={() => onSourceToggle(source.name)}
                    className="px-4 py-2 hover:-translate-y-0.5 hover:shadow-[0_2px_8px_rgba(0,0,0,0.06)]"
                  />
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

      {/* パーソナルサーチボタン */}
      <div className="mt-4">
        <button
          onClick={onPersonalSearchClick}
          className="group flex w-full items-center gap-3 rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-secondary)] p-4 text-left transition-all duration-200 hover:border-[var(--color-brand-primary)] hover:bg-[var(--color-bg-tertiary)] hover:shadow-sm"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[var(--color-brand-primary)]/10">
            <UserCircle className="h-5 w-5 text-[var(--color-brand-primary)]" />
          </div>
          <div className="flex-1">
            <h3 className="text-sm font-semibold text-[var(--color-text-primary)]">
              パーソナルサーチ
            </h3>
            <p className="mt-0.5 text-xs text-[var(--color-text-secondary)]">
              1～5個のタグで詳細検索
            </p>
          </div>
          <ChevronDown className="h-5 w-5 text-[var(--color-text-tertiary)] transition-transform group-hover:translate-x-0.5" />
        </button>
      </div>
    </section>
  );
}
