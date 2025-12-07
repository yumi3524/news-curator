import { Article } from "../types/types";

/**
 * Mock data for development
 * TODO: Replace with actual API calls in production
 */
export const mockArticles: Article[] = [
  {
    id: "1",
    title: "React 19 の新機能と破壊的変更の完全ガイド",
    description:
      "React 19で導入される新しいフック、Server Components、そして注意すべき破壊的変更について詳しく解説します。",
    url: "https://example.com/react-19-guide",
    publishedAt: "2025-11-20T10:00:00Z",
    source: {
      id: "tech-blog",
      name: "Tech Blog",
    },
    author: "山田太郎",
    tags: ["React", "JavaScript", "Frontend"],
    imageUrl: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&h=400&fit=crop",
  },
  {
    id: "2",
    title: "Next.js 15 App Router のパフォーマンス最適化テクニック",
    description:
      "App Routerを使用したNext.jsアプリケーションのパフォーマンスを最大化するための実践的なテクニックを紹介します。",
    url: "https://example.com/nextjs-performance",
    publishedAt: "2025-11-19T14:30:00Z",
    source: {
      id: "dev-community",
      name: "Dev Community",
    },
    author: "佐藤花子",
    tags: ["Next.js", "Performance", "React"],
    imageUrl: "https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=800&h=400&fit=crop",
  },
  {
    id: "3",
    title: "TypeScript 5.3 の新機能：型安全性の向上",
    description:
      "TypeScript 5.3で追加された新しい型システムの機能と、より安全なコードを書くためのベストプラクティス。",
    url: "https://example.com/typescript-5-3",
    publishedAt: "2025-11-18T09:15:00Z",
    source: {
      id: "typescript-weekly",
      name: "TypeScript Weekly",
    },
    author: "鈴木一郎",
    tags: ["TypeScript", "JavaScript", "Type Safety"],
    imageUrl: "https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=800&h=400&fit=crop",
  },
  {
    id: "4",
    title: "Tailwind CSS v4 ベータ版の新機能を試してみた",
    description:
      "Tailwind CSS v4で導入される新しいエンジン、パフォーマンス改善、そして開発体験の向上について実際に試した感想をまとめました。",
    url: "https://example.com/tailwind-v4",
    publishedAt: "2025-11-17T16:45:00Z",
    source: {
      id: "css-tricks",
      name: "CSS Tricks",
    },
    author: "田中美咲",
    tags: ["CSS", "Tailwind", "Frontend"],
    imageUrl: "https://images.unsplash.com/photo-1507721999472-8ed4421c4af2?w=800&h=400&fit=crop",
  },
  {
    id: "5",
    title: "Web パフォーマンス最適化：Core Web Vitals 完全攻略",
    description:
      "LCP、FID、CLSを改善するための具体的な手法と、実際のプロジェクトでの適用例を紹介します。",
    url: "https://example.com/core-web-vitals",
    publishedAt: "2025-11-16T11:20:00Z",
    source: {
      id: "web-perf",
      name: "Web Performance",
    },
    author: "高橋健太",
    tags: ["Performance", "Web Vitals", "SEO"],
    imageUrl: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=400&fit=crop",
  },
  {
    id: "6",
    title: "React Server Components の実践的な使い方",
    description:
      "Server Componentsの基本概念から、実際のアプリケーションでの活用方法まで、実例を交えて解説します。",
    url: "https://example.com/react-server-components",
    publishedAt: "2025-11-15T13:00:00Z",
    source: {
      id: "react-news",
      name: "React News",
    },
    author: "伊藤さくら",
    tags: ["React", "Server Components", "Next.js"],
    imageUrl: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&h=400&fit=crop",
  },
  {
    id: "7",
    title: "モダン JavaScript：ES2025 の新機能まとめ",
    description:
      "ES2025で追加された新しい言語機能と、それらを実際のプロジェクトでどう活用するかを解説します。",
    url: "https://example.com/es2025-features",
    publishedAt: "2025-11-14T10:30:00Z",
    source: {
      id: "js-weekly",
      name: "JavaScript Weekly",
    },
    author: "渡辺大輔",
    tags: ["JavaScript", "ES2025", "Language Features"],
    imageUrl: "https://images.unsplash.com/photo-1579468118864-1b9ea3c0db4a?w=800&h=400&fit=crop",
  },
  {
    id: "8",
    title: "アクセシビリティを考慮した React コンポーネント設計",
    description:
      "WCAG 2.1に準拠したアクセシブルなReactコンポーネントの作り方と、実装時の注意点を詳しく解説します。",
    url: "https://example.com/accessible-react",
    publishedAt: "2025-11-13T15:45:00Z",
    source: {
      id: "a11y-matters",
      name: "A11y Matters",
    },
    author: "小林由美",
    tags: ["Accessibility", "React", "WCAG"],
    imageUrl: "https://images.unsplash.com/photo-1573164713714-d95e436ab8d6?w=800&h=400&fit=crop",
  },
  {
    id: "9",
    title: "GraphQL vs REST：2025年の選択基準",
    description:
      "GraphQLとRESTの特徴を比較し、プロジェクトに応じた最適なAPI設計の選択方法を解説します。",
    url: "https://example.com/graphql-vs-rest",
    publishedAt: "2025-11-12T09:00:00Z",
    source: {
      id: "api-design",
      name: "API Design",
    },
    author: "中村拓也",
    tags: ["GraphQL", "REST", "API Design"],
    imageUrl: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&h=400&fit=crop",
  },
  {
    id: "10",
    title: "Docker と Kubernetes で構築する開発環境",
    description:
      "コンテナ技術を活用した効率的な開発環境の構築方法と、チーム開発での運用ノウハウを紹介します。",
    url: "https://example.com/docker-kubernetes-dev",
    publishedAt: "2025-11-11T14:15:00Z",
    source: {
      id: "devops-weekly",
      name: "DevOps Weekly",
    },
    author: "加藤誠",
    tags: ["Docker", "Kubernetes", "DevOps"],
    imageUrl: "https://images.unsplash.com/photo-1605745341112-85968b19335b?w=800&h=400&fit=crop",
  },
  {
    id: "11",
    title: "フロントエンドのテスト戦略：Jest から Vitest への移行",
    description:
      "Vitestの特徴と、JestからVitestへの移行手順、そしてテストパフォーマンスの改善について解説します。",
    url: "https://example.com/vitest-migration",
    publishedAt: "2025-11-10T11:30:00Z",
    source: {
      id: "testing-blog",
      name: "Testing Blog",
    },
    author: "山本真理",
    tags: ["Testing", "Vitest", "Jest"],
    imageUrl: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=400&fit=crop",
  },
  {
    id: "12",
    title: "Web セキュリティ基礎：XSS と CSRF 対策の実装",
    description:
      "Webアプリケーションにおける代表的な脆弱性であるXSSとCSRFについて、具体的な対策方法を実装例とともに解説します。",
    url: "https://example.com/web-security-basics",
    publishedAt: "2025-11-09T16:00:00Z",
    source: {
      id: "security-first",
      name: "Security First",
    },
    author: "森田健二",
    tags: ["Security", "XSS", "CSRF"],
    imageUrl: "https://images.unsplash.com/photo-1563986768609-322da13575f3?w=800&h=400&fit=crop",
  },
];

/**
 * Get all articles
 * @returns Array of articles
 */
export function getArticles(): Article[] {
  return mockArticles;
}

/**
 * Get article by ID
 * @param id - Article ID
 * @returns Article or undefined
 */
export function getArticleById(id: string): Article | undefined {
  return mockArticles.find((article) => article.id === id);
}

/**
 * Get articles by tag
 * @param tag - Tag name
 * @returns Array of articles with the specified tag
 */
export function getArticlesByTag(tag: string): Article[] {
  return mockArticles.filter((article) => article.tags.includes(tag));
}
