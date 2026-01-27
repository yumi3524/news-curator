'use client';

import { useState, useEffect } from 'react';
import { BookOpen, Clock, Target, TrendingUp, Flame } from 'lucide-react';
import { Header } from './Header';
import { StatCard } from './StatCard';
import { ProgressBar } from './ProgressBar';
import { StreakBadge } from './StreakBadge';
import { SourceTabs } from './SourceTabs';
import { ArticleCard } from './ArticleCard';
import { LoadingState } from './LoadingState';
import type { Article, Source } from '../types/types';

/** ダッシュボード統計データ */
interface DashboardStats {
  articlesRead: number;
  articlesReadTrend: string;
  totalReadingTime: number;
  readingTimeTrend: string;
  weeklyGoal: number;
  weeklyProgress: number;
  streakDays: number;
  isStreakRecord: boolean;
}

/** モックの統計データ */
const mockStats: DashboardStats = {
  articlesRead: 42,
  articlesReadTrend: '+12%',
  totalReadingTime: 186,
  readingTimeTrend: '+8%',
  weeklyGoal: 20,
  weeklyProgress: 15,
  streakDays: 7,
  isStreakRecord: false,
};

/**
 * ダッシュボードコンポーネント
 *
 * ユーザーの読書統計とお気に入り記事を表示します。
 */
export function Dashboard() {
  const [stats] = useState<DashboardStats>(mockStats);
  const [activeTab, setActiveTab] = useState<Source | 'all'>('all');
  const [articles, setArticles] = useState<Article[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // お気に入り記事の取得（モック）
  useEffect(() => {
    const fetchFavorites = async () => {
      setIsLoading(true);
      try {
        const response = await fetch('/api/articles');
        if (!response.ok) throw new Error('記事の取得に失敗しました');
        const data = await response.json();
        // モック: 最初の6件をお気に入りとして扱う
        const favorites = (data.articles || []).slice(0, 6).map((a: Article) => ({
          ...a,
          isFavorite: true,
        }));
        setArticles(favorites);
      } catch (err) {
        console.error('お気に入り記事の取得エラー:', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchFavorites();
  }, []);

  // ソースでフィルタリング
  const filteredArticles = activeTab === 'all'
    ? articles
    : articles.filter((a) => a.source === activeTab);

  // ソース別カウント
  const sourceCounts = {
    all: articles.length,
    qiita: articles.filter((a) => a.source === 'qiita').length,
    hackernews: articles.filter((a) => a.source === 'hackernews').length,
    github: articles.filter((a) => a.source === 'github').length,
  };

  const handleToggleFavorite = (articleId: string) => {
    setArticles((prev) =>
      prev.map((a) =>
        a.id === articleId ? { ...a, isFavorite: !a.isFavorite } : a
      )
    );
  };

  return (
    <>
      <Header />

      <main
        className="mx-auto max-w-[1400px] px-4 py-8 md:px-8"
        style={{ background: 'var(--color-bg-base)' }}
      >
        {/* ページタイトル */}
        <div className="mb-8">
          <h1
            className="text-[28px] font-bold tracking-[-0.02em] mb-2"
            style={{ color: 'var(--color-text-primary)' }}
          >
            ダッシュボード
          </h1>
          <p
            className="text-[14px]"
            style={{ color: 'var(--color-text-secondary)' }}
          >
            あなたの読書統計とお気に入り記事
          </p>
        </div>

        {/* 統計カードセクション */}
        <section className="mb-10" aria-labelledby="stats-heading">
          <h2 id="stats-heading" className="sr-only">
            読書統計
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard
              label="今週読んだ記事"
              value={stats.articlesRead}
              trend={stats.articlesReadTrend}
              trendDirection="up"
              icon={<BookOpen className="w-5 h-5" />}
            />
            <StatCard
              label="総読書時間"
              value={`${stats.totalReadingTime}分`}
              trend={stats.readingTimeTrend}
              trendDirection="up"
              icon={<Clock className="w-5 h-5" />}
            />
            <StatCard
              label="週間目標"
              value={`${stats.weeklyProgress}/${stats.weeklyGoal}`}
              icon={<Target className="w-5 h-5" />}
            />
            <StatCard
              label="連続日数"
              value={stats.streakDays}
              trendDirection="neutral"
              icon={<Flame className="w-5 h-5" />}
            />
          </div>
        </section>

        {/* 進捗とストリークセクション */}
        <section className="mb-10 grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* 週間目標プログレス */}
          <div
            className="p-6 rounded-[14px] border"
            style={{
              background: 'var(--color-bg-card)',
              borderColor: 'var(--color-border)',
            }}
          >
            <div className="flex items-center justify-between mb-4">
              <h3
                className="text-[15px] font-semibold"
                style={{ color: 'var(--color-text-primary)' }}
              >
                週間目標達成率
              </h3>
              <span
                className="text-[13px] font-medium"
                style={{ color: 'var(--color-accent-primary)' }}
              >
                {Math.round((stats.weeklyProgress / stats.weeklyGoal) * 100)}%
              </span>
            </div>
            <ProgressBar
              value={stats.weeklyProgress}
              max={stats.weeklyGoal}
              size="md"
            />
            <p
              className="mt-3 text-[12px]"
              style={{ color: 'var(--color-text-tertiary)' }}
            >
              あと{stats.weeklyGoal - stats.weeklyProgress}記事で今週の目標達成です
            </p>
          </div>

          {/* ストリークバッジ */}
          <div
            className="p-6 rounded-[14px] border flex items-center gap-6"
            style={{
              background: 'var(--color-bg-card)',
              borderColor: 'var(--color-border)',
            }}
          >
            <StreakBadge
              days={stats.streakDays}
              size="lg"
              isRecord={stats.isStreakRecord}
            />
            <div>
              <h3
                className="text-[15px] font-semibold mb-1"
                style={{ color: 'var(--color-text-primary)' }}
              >
                連続学習記録
              </h3>
              <p
                className="text-[13px]"
                style={{ color: 'var(--color-text-secondary)' }}
              >
                {stats.streakDays}日連続で記事を読んでいます
              </p>
              {stats.isStreakRecord && (
                <p
                  className="text-[12px] mt-1 flex items-center gap-1"
                  style={{ color: 'var(--color-accent-primary)' }}
                >
                  <TrendingUp className="w-3 h-3" />
                  自己ベスト更新中
                </p>
              )}
            </div>
          </div>
        </section>

        {/* お気に入り記事セクション */}
        <section aria-labelledby="favorites-heading">
          <div className="flex items-center justify-between mb-6">
            <h2
              id="favorites-heading"
              className="text-[20px] font-semibold"
              style={{ color: 'var(--color-text-primary)' }}
            >
              お気に入り記事
            </h2>
            <SourceTabs
              activeTab={activeTab}
              onTabChange={setActiveTab}
              counts={sourceCounts}
            />
          </div>

          {isLoading ? (
            <LoadingState />
          ) : filteredArticles.length === 0 ? (
            <div
              className="text-center py-12 rounded-[14px] border"
              style={{
                background: 'var(--color-bg-card)',
                borderColor: 'var(--color-border)',
              }}
            >
              <p style={{ color: 'var(--color-text-tertiary)' }}>
                お気に入り記事がありません
              </p>
            </div>
          ) : (
            <div
              className="grid grid-cols-[repeat(auto-fill,minmax(300px,1fr))] gap-6"
              role="tabpanel"
              id={`tabpanel-${activeTab}`}
              aria-labelledby={`tab-${activeTab}`}
            >
              {filteredArticles.map((article) => (
                <ArticleCard
                  key={article.id}
                  article={article}
                  onToggleFavorite={handleToggleFavorite}
                />
              ))}
            </div>
          )}
        </section>
      </main>
    </>
  );
}
