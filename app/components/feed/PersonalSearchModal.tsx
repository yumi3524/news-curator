'use client';

import { X, Plus, Search } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Button } from '../ui/Button';
import { Tag } from '../ui/Tag';
import { Input } from '../ui/Input';
import { Modal } from '../ui/Modal';
import { toggleArrayItem } from '@/app/lib/utils';

interface PersonalSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  availableTags: string[];
  onSearch: (tags: string[]) => Promise<void>;
}

export function PersonalSearchModal({
  isOpen,
  onClose,
  availableTags,
  onSearch,
}: PersonalSearchModalProps) {
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [customTag, setCustomTag] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  const MIN_TAGS = 1;
  const MAX_TAGS = 5;

  useEffect(() => {
    if (!isOpen) {
      setSelectedTags([]);
      setCustomTag('');
      setSearchQuery('');
    }
  }, [isOpen]);

  const filteredTags = availableTags.filter((tag) =>
    tag.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const canSearch =
    selectedTags.length >= MIN_TAGS && selectedTags.length <= MAX_TAGS;

  const handleTagToggle = (tag: string) => {
    setSelectedTags((prev) => toggleArrayItem(prev, tag, MAX_TAGS));
  };

  const handleAddCustomTag = () => {
    if (
      customTag.trim() &&
      !selectedTags.includes(customTag.trim()) &&
      selectedTags.length < MAX_TAGS
    ) {
      setSelectedTags([...selectedTags, customTag.trim()]);
      setCustomTag('');
    }
  };

  const handleSearch = async () => {
    if (!canSearch) return;
    setIsSearching(true);
    try {
      await onSearch(selectedTags);
      onClose();
    } catch (error) {
      console.error('パーソナルサーチエラー:', error);
    } finally {
      setIsSearching(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && customTag.trim()) {
      e.preventDefault();
      handleAddCustomTag();
    }
  };

  if (!isOpen) return null;

  return (
    <Modal
      icon={<Search className="h-4 w-4 text-[var(--color-brand-primary)]" />}
      title="パーソナルサーチ"
      description={`${MIN_TAGS}〜${MAX_TAGS}個のタグを選択して検索`}
      onClose={onClose}
      actions={
        <>
          <Button onClick={onClose} variant="secondary" size="lg" fullWidth>
            キャンセル
          </Button>
          <Button
            onClick={handleSearch}
            disabled={!canSearch || isSearching}
            variant="primary"
            size="lg"
            fullWidth
            className="min-w-[120px]"
          >
            {isSearching ? '検索中...' : '検索実行'}
          </Button>
        </>
      }
    >
      {/* 選択中のタグ */}
      <div className="mb-6 rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-secondary)] p-4">
        <div className="mb-2 flex items-center justify-between">
          <span className="text-sm font-semibold text-[var(--color-text-secondary)]">
            選択中のタグ
          </span>
          <span
            className={`text-sm font-bold ${canSearch
              ? 'text-[var(--color-brand-primary)]'
              : 'text-[var(--color-text-tertiary)]'
              }`}
          >
            {selectedTags.length} / {MAX_TAGS}
          </span>
        </div>
        <div className="flex min-h-[40px] flex-wrap gap-2">
          {selectedTags.length === 0 ? (
            <p className="text-sm text-[var(--color-text-tertiary)]">
              下からタグを選択してください
            </p>
          ) : (
            selectedTags.map((tag) => (
              <Tag
                key={tag}
                label={tag}
                variant="selected"
                size="sm"
                onClick={() => handleTagToggle(tag)}
                className="pr-1"
              >
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleTagToggle(tag);
                  }}
                  className="ml-1 rounded-full hover:bg-white/20 p-0.5"
                >
                  <X className="h-3 w-3" />
                </button>
              </Tag>
            ))
          )}
        </div>
        {selectedTags.length < MIN_TAGS && selectedTags.length > 0 && (
          <p className="mt-2 text-xs text-[var(--color-accent-dark)]">
            あと{MIN_TAGS - selectedTags.length}個選択してください
          </p>
        )}
      </div>

      {/* カスタムタグ入力 */}
      <div className="mb-6">
        <label className="mb-2 block text-sm font-semibold text-[var(--color-text-secondary)]">
          カスタムタグを追加
        </label>
        <div className="flex gap-2">
          <div className="flex-1">
            <Input
              type="text"
              value={customTag}
              onChange={(e) => setCustomTag(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="例: Cursor"
              disabled={selectedTags.length >= MAX_TAGS}
              fullWidth
            />
          </div>
          <Button
            onClick={handleAddCustomTag}
            disabled={!customTag.trim() || selectedTags.length >= MAX_TAGS}
            variant="primary"
            className="shrink-0 min-w-[100px]"
          >
            <Plus className="h-4 w-4" />
            追加
          </Button>
        </div>
      </div>

      {/* タグ検索 */}
      <div className="mb-4">
        <label className="mb-2 block text-sm font-semibold text-[var(--color-text-secondary)]">
          既存タグから選択
        </label>
        <Input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="タグを検索..."
          leftIcon={<Search className="h-4 w-4" />}
          fullWidth
        />
      </div>

      {/* タグ一覧 */}
      <div className="mb-6 max-h-[150px] overflow-y-auto rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-secondary)] p-4">
        <div className="flex flex-wrap gap-2">
          {filteredTags.length === 0 ? (
            <p className="text-sm text-[var(--color-text-tertiary)]">
              該当するタグが見つかりません
            </p>
          ) : (
            filteredTags.slice(0, 50).map((tag) => {
              const isSelected = selectedTags.includes(tag);
              const isDisabled =
                !isSelected && selectedTags.length >= MAX_TAGS;

              return (
                <Tag
                  key={tag}
                  label={tag}
                  variant={isSelected ? 'selected' : 'outline'}
                  size="sm"
                  onClick={() => handleTagToggle(tag)}
                  disabled={isDisabled}
                />
              );
            })
          )}
        </div>
      </div>
    </Modal>
  );
}
