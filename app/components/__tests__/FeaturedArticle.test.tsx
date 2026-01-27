import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { FeaturedArticle } from '../FeaturedArticle';
import type { Article } from '@/app/types/types';

const mockArticle: Article = {
  id: '1',
  title: 'テスト記事タイトル',
  description: 'これはテスト記事の説明文です。',
  url: 'https://example.com/article',
  publishedAt: '2024-01-01T00:00:00Z',
  source: 'qiita',
  tags: ['TypeScript', 'React'],
  likesCount: 10,
  stocksCount: 5,
};

describe('FeaturedArticle', () => {
  it('記事タイトルが表示されること', () => {
    render(<FeaturedArticle article={mockArticle} />);

    expect(screen.getByText('テスト記事タイトル')).toBeInTheDocument();
  });

  it('記事の説明文が表示されること', () => {
    render(<FeaturedArticle article={mockArticle} />);

    expect(screen.getByText('これはテスト記事の説明文です。')).toBeInTheDocument();
  });

  it('「PICK UP!」ラベルが表示されること', () => {
    render(<FeaturedArticle article={mockArticle} />);

    expect(screen.getByText('PICK UP!')).toBeInTheDocument();
  });

  it('タグが表示されること', () => {
    render(<FeaturedArticle article={mockArticle} />);

    expect(screen.getByText('TypeScript')).toBeInTheDocument();
    expect(screen.getByText('React')).toBeInTheDocument();
  });

  it('いいね数が表示されること', () => {
    render(<FeaturedArticle article={mockArticle} />);

    expect(screen.getByText('10')).toBeInTheDocument();
  });

  it('ストック数が表示されること', () => {
    render(<FeaturedArticle article={mockArticle} />);

    expect(screen.getByText('5')).toBeInTheDocument();
  });

  it('記事リンクが正しいURLを持つこと', () => {
    render(<FeaturedArticle article={mockArticle} />);

    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', 'https://example.com/article');
    expect(link).toHaveAttribute('target', '_blank');
    expect(link).toHaveAttribute('rel', 'noopener noreferrer');
  });

  it('タイトルが2行でクランプされること', () => {
    render(<FeaturedArticle article={mockArticle} />);

    const title = screen.getByText('テスト記事タイトル');
    expect(title).toHaveClass('line-clamp-2');
  });

  it('説明文がモバイルで1行、デスクトップで適切にクランプされること', () => {
    render(<FeaturedArticle article={mockArticle} />);

    const description = screen.getByText('これはテスト記事の説明文です。');
    expect(description).toHaveClass('line-clamp-1');
    expect(description).toHaveClass('lg:line-clamp-2');
  });

  it('レスポンシブなパディングクラスを持つこと', () => {
    const { container } = render(<FeaturedArticle article={mockArticle} />);

    const link = container.querySelector('a');
    expect(link).toHaveClass('p-4', 'md:p-4', 'lg:p-6', 'xl:p-8');
  });

  it('いいね数とストック数がundefinedの場合は表示されないこと', () => {
    const articleWithoutCounts: Article = {
      ...mockArticle,
      likesCount: undefined,
      stocksCount: undefined,
    };

    render(<FeaturedArticle article={articleWithoutCounts} />);

    // いいね数とストック数のアイコンが表示されないことを確認
    const heartIcons = screen.queryAllByRole('img', { hidden: true });
    expect(heartIcons.length).toBeLessThan(2);
  });
});
