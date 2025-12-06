# API統合ガイド

このドキュメントでは、News Curatorアプリケーションに外部APIを統合する方法について説明します。

## 現在の実装

現在、アプリケーションは `app/data/mockData.ts` に定義されたモックデータを使用しています。

### モックデータの構造

```typescript
interface Article {
  id: string;
  title: string;
  description: string;
  url: string;
  publishedAt: string; // ISO 8601形式
  source: ArticleSource;
  author?: string;
  tags: string[];
  imageUrl?: string;
}

interface ArticleSource {
  id: string;
  name: string;
}
```

## API統合の手順

### 1. 環境変数の設定

`.env.local` ファイルを作成し、APIキーを設定します：

```bash
# News API の例
NEWS_API_KEY=your_api_key_here
NEWS_API_BASE_URL=https://newsapi.org/v2
```

### 2. APIクライアントの作成

`app/lib/api.ts` を作成し、API通信のロジックを実装します：

```typescript
// app/lib/api.ts
import { Article } from "../types/types";

const API_KEY = process.env.NEWS_API_KEY;
const BASE_URL = process.env.NEWS_API_BASE_URL;

export async function fetchArticles(): Promise<Article[]> {
  try {
    const response = await fetch(
      `${BASE_URL}/top-headlines?category=technology&language=ja&apiKey=${API_KEY}`,
      {
        next: { revalidate: 3600 }, // 1時間ごとに再検証
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch articles");
    }

    const data = await response.json();
    
    // APIレスポンスをArticle型に変換
    return data.articles.map((article: any) => ({
      id: article.url, // URLをIDとして使用
      title: article.title,
      description: article.description || "",
      url: article.url,
      publishedAt: article.publishedAt,
      source: {
        id: article.source.id || "unknown",
        name: article.source.name,
      },
      author: article.author,
      tags: ["Technology"], // APIによってはタグ情報がない場合があるため、デフォルト値を設定
      imageUrl: article.urlToImage,
    }));
  } catch (error) {
    console.error("Error fetching articles:", error);
    return [];
  }
}

export async function fetchArticleById(id: string): Promise<Article | null> {
  // 実装例：特定の記事を取得
  const articles = await fetchArticles();
  return articles.find((article) => article.id === id) || null;
}
```

### 3. ページコンポーネントの更新

`app/page.tsx` を更新してAPIからデータを取得します：

```typescript
// app/page.tsx
import Header from "./components/Header";
import ArticleList from "./components/ArticleList";
import { fetchArticles } from "./lib/api";

export default async function Home() {
  const articles = await fetchArticles();

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-12 animate-fade-in">
          <h1 className="mb-4 text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
            最新の技術記事
          </h1>
          <p className="text-lg text-gray-600">
            厳選された技術記事をお届けします。React、Next.js、TypeScriptなど、モダンな開発技術に関する情報をキュレーション。
          </p>
        </div>

        <ArticleList articles={articles} />
      </main>

      <footer className="mt-16 border-t border-gray-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <p className="text-center text-sm text-gray-500">
            © 2024 News Curator. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
```

### 4. 記事詳細ページの更新

`app/articles/[id]/page.tsx` も同様に更新します：

```typescript
import { fetchArticleById } from "../../lib/api";

export default async function ArticlePage({ params }: ArticlePageProps) {
  const { id } = await params;
  const article = await fetchArticleById(id);

  if (!article) {
    notFound();
  }

  // ... 残りのコード
}
```

## 推奨されるAPI

### 1. News API

- **URL**: https://newsapi.org/
- **特徴**: 
  - 多数のニュースソースに対応
  - カテゴリ、キーワード、日付でフィルタリング可能
  - 無料プランあり（開発用）
- **制限**: 無料プランは1日100リクエストまで

### 2. RSS フィード

技術ブログのRSSフィードを直接パースする方法：

```typescript
// app/lib/rss.ts
import Parser from "rss-parser";

const parser = new Parser();

export async function fetchRSSArticles(feedUrl: string) {
  const feed = await parser.parseURL(feedUrl);
  
  return feed.items.map((item) => ({
    id: item.guid || item.link,
    title: item.title,
    description: item.contentSnippet || item.summary,
    url: item.link,
    publishedAt: item.isoDate,
    source: {
      id: feed.title,
      name: feed.title,
    },
    tags: item.categories || [],
  }));
}
```

### 3. カスタムAPI

独自のバックエンドAPIを構築する場合：

```typescript
// app/lib/customApi.ts
export async function fetchArticles() {
  const response = await fetch("https://your-api.com/articles", {
    headers: {
      "Authorization": `Bearer ${process.env.API_TOKEN}`,
    },
    next: { revalidate: 3600 },
  });

  return response.json();
}
```

## データキャッシング戦略

Next.js App Routerでは、以下のキャッシング戦略を使用できます：

### 1. 時間ベースの再検証

```typescript
fetch(url, {
  next: { revalidate: 3600 } // 1時間ごとに再検証
});
```

### 2. オンデマンド再検証

```typescript
import { revalidatePath } from "next/cache";

// 特定のパスを再検証
revalidatePath("/");
```

### 3. 静的生成

```typescript
export const dynamic = "force-static";
```

## エラーハンドリング

APIエラーを適切に処理するための推奨パターン：

```typescript
export async function fetchArticles(): Promise<Article[]> {
  try {
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error("Failed to fetch articles:", error);
    
    // フォールバック: モックデータを返す
    return mockArticles;
  }
}
```

## テスト

API統合後は、以下をテストしてください：

1. **正常系**
   - 記事一覧が正しく表示される
   - 記事詳細ページが正しく表示される
   - 画像が正しく読み込まれる

2. **異常系**
   - APIエラー時のフォールバック
   - ネットワークエラー時の挙動
   - データが空の場合の表示

3. **パフォーマンス**
   - 初回ロード時間
   - キャッシュの効果
   - 画像の遅延読み込み

## セキュリティ

- **APIキーの保護**: 環境変数を使用し、クライアントサイドに露出させない
- **レート制限**: APIのレート制限を遵守する
- **データ検証**: APIレスポンスを必ず検証する
- **CORS**: 必要に応じてCORS設定を行う

## まとめ

このガイドに従って、段階的にAPI統合を進めてください。まずは開発環境で動作確認を行い、問題がなければプロダクション環境にデプロイします。
