# News Curator - 技術記事キュレーション

最新の技術記事を厳選してお届けするキュレーションプラットフォーム

## 🚀 特徴

- **モダンな技術スタック**: Next.js 16 (App Router) + TypeScript + Tailwind CSS v4
- **レスポンシブデザイン**: モバイル、タブレット、デスクトップに対応
- **高速なページ遷移**: Next.js App Routerによる最適化されたルーティング
- **型安全**: TypeScriptによる堅牢な型定義

## 📋 前提条件

- Node.js 18.x 以上
- pnpm (推奨) または npm

## 🛠️ セットアップ

### インストール

```bash
# 依存関係のインストール
pnpm install
```

### 開発サーバーの起動

```bash
pnpm dev
```

ブラウザで [http://localhost:3000](http://localhost:3000) を開いてアプリケーションを確認できます。

### ビルド

```bash
# プロダクションビルド
pnpm build

# ビルドしたアプリケーションの起動
pnpm start
```

### Lint

```bash
pnpm lint
```

## 📁 プロジェクト構造

```
news-curator/
├── app/
│   ├── articles/
│   │   └── [id]/
│   │       └── page.tsx          # 記事詳細ページ（動的ルーティング）
│   ├── components/
│   │   ├── ArticleCard.tsx       # 記事カードコンポーネント
│   │   ├── ArticleList.tsx       # 記事一覧コンポーネント
│   │   └── Header.tsx            # ヘッダーコンポーネント
│   ├── data/
│   │   └── mockData.ts           # モックデータ
│   ├── types/
│   │   └── types.ts              # TypeScript型定義
│   ├── globals.css               # グローバルスタイル
│   ├── layout.tsx                # ルートレイアウト
│   └── page.tsx                  # トップページ（記事一覧）
├── public/                       # 静的ファイル
└── docs/                         # ドキュメント
    └── API_INTEGRATION.md        # API統合ガイド
```

## 🎨 主要コンポーネント

### ArticleCard

記事カードを表示するコンポーネント。サムネイル画像、タイトル、説明文、タグ、メタ情報を含みます。

```tsx
import ArticleCard from "./components/ArticleCard";

<ArticleCard article={article} />
```

### ArticleList

記事一覧をグリッドレイアウトで表示するコンポーネント。レスポンシブ対応。

```tsx
import ArticleList from "./components/ArticleList";

<ArticleList articles={articles} />
```

### Header

アプリケーションのヘッダー。ロゴとナビゲーションを含みます。

```tsx
import Header from "./components/Header";

<Header />
```

## 🔄 API統合について

現在はモックデータ（`app/data/mockData.ts`）を使用していますが、将来的に外部APIと統合することを想定した設計になっています。

詳細は [API統合ガイド](./docs/API_INTEGRATION.md) を参照してください。

### モックデータの構造

```typescript
interface Article {
  id: string;
  title: string;
  description: string;
  url: string;
  publishedAt: string;
  source: ArticleSource;
  author?: string;
  tags: string[];
  imageUrl?: string;
}
```

## 🎯 今後の拡張予定

- [ ] 記事の検索機能
- [ ] タグによるフィルタリング
- [ ] お気に入り機能
- [ ] 外部API統合（News API、RSS等）
- [ ] ダークモード対応
- [ ] ページネーション
- [ ] ソート機能（日付、人気度等）

## 📝 開発ガイドライン

### コーディング規約

- **TypeScript**: 型定義を必ず行う
- **コンポーネント**: 単一責任の原則に従う
- **スタイリング**: Tailwind CSSのユーティリティクラスを使用
- **命名規則**: 
  - コンポーネント: PascalCase
  - 関数・変数: camelCase
  - 定数: UPPER_SNAKE_CASE

### コミット規約

```
feat: 新機能
fix: バグ修正
docs: ドキュメント更新
style: コードスタイルの変更
refactor: リファクタリング
test: テスト追加・修正
chore: ビルドプロセス等の変更
```


## 🙏 謝辞

- [Next.js](https://nextjs.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Unsplash](https://unsplash.com/) - サムネイル画像
