import { describe, it, expect, vi, beforeEach, type Mock } from 'vitest';
import { QiitaAPIFetcher } from '../qiita-api';
import { QiitaItem } from '../types';

describe('QiitaAPIFetcher', () => {
  let fetcher: QiitaAPIFetcher;

  beforeEach(() => {
    fetcher = new QiitaAPIFetcher();
    global.fetch = vi.fn();
    vi.clearAllMocks();
  });

  const mockQiitaResponse: QiitaItem[] = [
    {
      id: '1',
      title: 'Test Article',
      body: '# Header\nThis is a test article.',
      url: 'https://qiita.com/test',
      created_at: '2023-01-01T00:00:00Z',
      user: {
        id: 'testuser',
        profile_image_url: 'https://example.com/avatar.png',
      },
      tags: [{ name: 'React' }, { name: 'TypeScript' }],
      likes_count: 10,
      stocks_count: 5,
    },
  ];

  it('記事を正常に取得できること', async () => {
    (global.fetch as Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockQiitaResponse,
    });

    const articles = await fetcher.fetch();

    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining('https://qiita.com/api/v2/items'),
      expect.anything()
    );
    expect(articles).toHaveLength(1);
    expect(articles[0]).toEqual({
      id: '1',
      title: 'Test Article',
      description: 'This is a test article....',
      url: 'https://qiita.com/test',
      publishedAt: '2023-01-01T00:00:00Z',
      source: { id: 'qiita', name: 'Qiita' },
      author: 'testuser',
      tags: ['React', 'TypeScript'],
      imageUrl: 'https://example.com/avatar.png',
      likesCount: 10,
      stocksCount: 5,
    });
  });

  it('APIエラーを適切に処理できること', async () => {
    // テスト中の意図的なエラーログ出力を抑制
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    (global.fetch as Mock).mockResolvedValueOnce({
      ok: false,
      status: 500,
      statusText: 'Internal Server Error',
    });

    await expect(fetcher.fetch()).rejects.toThrow('Qiita API エラー: 500 Internal Server Error');
    
    // ログが出力されようとしたことを確認
    expect(consoleSpy).toHaveBeenCalled();
    
    consoleSpy.mockRestore();
  });

  it('オプション指定時のURLが正しく構築されること', async () => {
    (global.fetch as Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => [],
    });

    await fetcher.fetch({ tag: 'Next.js', limit: 10, days: 3 });

    const callArgs = (global.fetch as Mock).mock.calls[0];
    const url = callArgs[0];
    
    expect(url).toContain('per_page=10');
    expect(url).toContain('tag%3ANext.js'); 
    // Note: URLSearchParams encodes characters, checking for partial match
  });

  it('記事がいいね数順でソートされること', async () => {
    const unsortedResponse = [
      { ...mockQiitaResponse[0], id: '1', likes_count: 5 },
      { ...mockQiitaResponse[0], id: '2', likes_count: 20 },
      { ...mockQiitaResponse[0], id: '3', likes_count: 10 },
    ];

    (global.fetch as Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => unsortedResponse,
    });

    const articles = await fetcher.fetch({ sortBy: 'likes' });

    expect(articles[0].likesCount).toBe(20);
    expect(articles[1].likesCount).toBe(10);
    expect(articles[2].likesCount).toBe(5);
  });
});
