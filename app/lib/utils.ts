/**
 * 配列内の要素をトグル（含まれていれば除去、なければ追加）
 */
export function toggleArrayItem<T>(array: T[], item: T, maxItems?: number): T[] {
  if (array.includes(item)) {
    return array.filter((i) => i !== item);
  }
  if (maxItems !== undefined && array.length >= maxItems) {
    return array;
  }
  return [...array, item];
}

/**
 * HTML タグを除去
 */
export function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, '').trim();
}

/**
 * Markdown 記法を除去してプレーンテキストに変換
 */
export function stripMarkdown(markdown: string): string {
  return markdown
    .replace(/^#+\s+.*$/gm, '')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/!\[[^\]]*\]\([^)]+\)/g, '')
    .replace(/```[\s\S]*?```/g, '')
    .replace(/`([^`]+)`/g, '$1')
    .replace(/<[^>]*>/g, '')
    .replace(/\n\s*\n/g, '\n')
    .trim();
}

export function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const hours = Math.floor(diff / (1000 * 60 * 60));

  if (hours < 1) return '1時間以内';
  if (hours < 24) return `${hours}時間前`;

  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}日前`;

  return date.toLocaleDateString('ja-JP', { month: 'short', day: 'numeric' });
}
