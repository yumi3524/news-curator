import { CacheData, CacheArticle } from '@/app/types/cache';
import { ArticleFetcher, ExternalArticle, FetchOptions } from './types';
import { promises as fs } from 'fs';
import path from 'path';

/**
 * キャッシュJSONフェッチャー
 * @see docs/cache-schema.md
 */
export class CacheFetcher implements ArticleFetcher {
  private cachePath: string;

  constructor(cachePath?: string) {
    this.cachePath = cachePath || path.join(process.cwd(), 'public/cache/articles.json');
  }

  /**
   * キャッシュJSONを取得（ファイルシステムから直接読み込み）
   */
  async fetchCache(): Promise<CacheData> {
    const content = await fs.readFile(this.cachePath, 'utf-8');
    const data: CacheData = JSON.parse(content);

    // スキーマバージョンチェック
    if (data.schemaVersion !== 1) {
      throw new Error(`Unsupported schema version: ${data.schemaVersion}`);
    }

    return data;
  }

  /**
   * CacheArticle → ExternalArticle 変換
   */
  private mapCacheToExternal(article: CacheArticle): ExternalArticle {
    // キャッシュのsource文字列をSource型に変換
    const sourceMap: Record<string, 'qiita' | 'hackernews' | 'github'> = {
      'qiita': 'qiita',
      'hackernews': 'hackernews',
      'github': 'github',
    };
    const source = sourceMap[article.source] || 'qiita';

    return {
      id: article.id,
      title: article.title,
      description: '', // キャッシュには含まれていない
      url: article.url,
      publishedAt: article.publishedAt,
      source,
      author: article.author.id,
      tags: article.tags,
      imageUrl: article.author.avatarUrl,
      likesCount: article.likes,
      stocksCount: undefined
    };
  }

  /**
   * ArticleFetcherインターフェース実装
   */
  async fetch(options?: FetchOptions): Promise<ExternalArticle[]> {
    if (options?.tags && options.tags.length > 0) {
      return this.fetchByTags(options.tags);
    }
    if (options?.tag) {
      return this.fetchByTag(options.tag);
    }
    return this.fetchAll(options?.limit);
  }

  /**
   * 全記事を取得（ExternalArticle形式）
   */
  async fetchAll(limit?: number): Promise<ExternalArticle[]> {
    const cache = await this.fetchCache();
    const articles = cache.articles.map(a => this.mapCacheToExternal(a));
    return limit ? articles.slice(0, limit) : articles;
  }

  /**
   * タグでフィルタ（tagIndexを優先使用）
   */
  async fetchByTag(tag: string): Promise<ExternalArticle[]> {
    const cache = await this.fetchCache();

    // tagIndexがある場合は優先使用
    if (cache.tagIndex && cache.tagIndex[tag]) {
      const articleIds = new Set(cache.tagIndex[tag]);
      return cache.articles
        .filter(a => articleIds.has(a.id))
        .map(a => this.mapCacheToExternal(a));
    }

    // フォールバック: articles を走査
    return cache.articles
      .filter(a => a.tags.includes(tag))
      .map(a => this.mapCacheToExternal(a));
  }

  /**
   * 複数タグでフィルタ（OR検索）
   */
  async fetchByTags(tags: string[]): Promise<ExternalArticle[]> {
    const cache = await this.fetchCache();
    const tagSet = new Set(tags);

    return cache.articles
      .filter(a => a.tags.some(t => tagSet.has(t)))
      .map(a => this.mapCacheToExternal(a));
  }

  /**
   * トレンドTOP（3〜5）を取得
   */
  async getTrendingTags(limit: number = 5): Promise<Array<{name: string, count: number}>> {
    const cache = await this.fetchCache();
    return Object.entries(cache.tagCounts)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, limit);
  }

  /**
   * 注目タグ一覧（20〜30）を取得
   */
  async getPopularTags(limit: number = 30): Promise<Array<{name: string, count: number}>> {
    const cache = await this.fetchCache();
    return Object.entries(cache.tagCounts)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, limit);
  }
}
