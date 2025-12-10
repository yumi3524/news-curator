import { useCallback } from 'react';

/**
 * タグクリック時のイベントハンドラを生成するカスタムフック
 * イベントの伝播を止めて、親要素のクリックイベントと競合しないようにする
 *
 * @param onTagClick - タグがクリックされた時に呼ばれるコールバック関数
 * @returns タグクリックハンドラ関数
 *
 * @example
 * ```tsx
 * const handleTagClick = useTagClickHandler(onTagClick);
 * 
 * <button onClick={(e) => handleTagClick(e, tag)}>
 *   {tag}
 * </button>
 * ```
 */
export const useTagClickHandler = (onTagClick?: (tag: string) => void) => {
  const handleTagClick = useCallback(
    (e: React.MouseEvent, tag: string) => {
      e.preventDefault();
      e.stopPropagation();
      onTagClick?.(tag);
    },
    [onTagClick]
  );

  return handleTagClick;
};
