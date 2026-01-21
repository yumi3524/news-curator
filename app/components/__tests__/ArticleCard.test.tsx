import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ArticleCard } from '../ArticleCard';
import type { Article } from '../../types/types';

const context = describe;

const createMockArticle = (overrides: Partial<Article> = {}): Article => ({
  id: '1',
  title: 'React 19の新機能',
  description: 'React 19で導入される新機能について解説します',
  url: 'https://example.com/article/1',
  publishedAt: '2024-11-20T10:00:00Z',
  source: { id: 'tech-blog', name: 'Tech Blog' },
  author: '山田太郎',
  tags: ['React', 'JavaScript', 'Frontend'],
  isFavorite: false,
  likesCount: 42,
  stocksCount: 15,
  ...overrides,
});

describe('ArticleCard', () => {
  const mockOnToggleFavorite = vi.fn();
  const mockOnTagClick = vi.fn();

  beforeEach(() => {
    mockOnToggleFavorite.mockClear();
    mockOnTagClick.mockClear();
  });

  const renderArticleCard = (
    articleOverrides: Partial<Article> = {},
    props: { onToggleFavorite?: (id: string) => void; onTagClick?: (tag: string) => void } = {}
  ) => {
    const article = createMockArticle(articleOverrides);
    return render(
      <ArticleCard
        article={article}
        onToggleFavorite={props.onToggleFavorite}
        onTagClick={props.onTagClick}
      />
    );
  };

  describe('基本表示', () => {
    context('通常の記事データの場合', () => {
      it('記事タイトルが表示されること', () => {
        renderArticleCard({ title: 'React 19の新機能' });
        expect(screen.getByTestId('article-title')).toHaveTextContent('React 19の新機能');
      });

      it('ソース名が表示されること', () => {
        renderArticleCard();
        const meta = screen.getByTestId('article-meta');
        expect(meta).toHaveTextContent('Tech Blog');
      });
    });
  });

  describe('タグ表示', () => {
    context('タグが設定されている場合', () => {
      it('タグが表示されること', () => {
        renderArticleCard({ tags: ['React', 'JavaScript'] });
        const tags = screen.getByTestId('article-tags');
        expect(tags).toHaveTextContent('React');
        expect(tags).toHaveTextContent('JavaScript');
      });
    });
  });

  describe('お気に入り機能', () => {
    context('onToggleFavoriteが渡されていない場合', () => {
      it('お気に入りボタンが表示されないこと', () => {
        renderArticleCard();
        expect(screen.queryByTestId('favorite-button')).not.toBeInTheDocument();
      });
    });

    context('onToggleFavoriteが渡されている場合', () => {
      it('お気に入りボタンが表示されること', () => {
        renderArticleCard({}, { onToggleFavorite: mockOnToggleFavorite });
        expect(screen.getByTestId('favorite-button')).toBeInTheDocument();
      });

      it('お気に入りボタンをクリックするとコールバックが呼ばれること', () => {
        renderArticleCard({ isFavorite: false }, { onToggleFavorite: mockOnToggleFavorite });
        fireEvent.click(screen.getByTestId('favorite-button'));
        expect(mockOnToggleFavorite).toHaveBeenCalledWith('1');
      });

      it('お気に入り未登録時は適切なaria-labelが設定されること', () => {
        renderArticleCard({ isFavorite: false }, { onToggleFavorite: mockOnToggleFavorite });
        expect(screen.getByTestId('favorite-button')).toHaveAttribute('aria-label', 'お気に入りに追加');
      });

      it('お気に入り登録済み時は適切なaria-labelが設定されること', () => {
        renderArticleCard({ isFavorite: true }, { onToggleFavorite: mockOnToggleFavorite });
        expect(screen.getByTestId('favorite-button')).toHaveAttribute('aria-label', 'お気に入りから削除');
      });
    });
  });

  describe('外部リンク', () => {
    it('記事URLが正しく設定されていること', () => {
      renderArticleCard({ url: 'https://example.com/article/1' });
      const link = screen.getByTestId('article-card');
      expect(link).toHaveAttribute('href', 'https://example.com/article/1');
    });

    it('リンクが新しいタブで開くように設定されていること', () => {
      renderArticleCard();
      const link = screen.getByTestId('article-card');
      expect(link).toHaveAttribute('target', '_blank');
      expect(link).toHaveAttribute('rel', 'noopener noreferrer');
    });
  });
});
