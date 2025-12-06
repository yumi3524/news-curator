# News Curator – 技術記事キュレーションアプリ

最新の技術記事をカード形式で一覧・閲覧できる、フロントエンド特化のキュレーションアプリケーションです。

## 目的（Purpose）

- フロントエンド（Next.js / TypeScript / Tailwind CSS）を用いた  
  **カードレイアウト中心の一覧・詳細UIの設計力を示すこと**
- App Router 構成や型定義、コンポーネント分割など、  
  **モダンなReactアプリケーションの基本設計をポートフォリオとして提示すること**
- 将来的な外部API連携（News API / RSS など）を見据えて、  
  **データ層を分離した「拡張しやすいアーキテクチャ」を検証すること**

---

## 機能（Features）

### 実装済み

- **技術記事一覧の表示**
  - カードレイアウトでタイトル・概要・タグ・公開日などを表示
  - レスポンシブ対応（モバイル / タブレット / デスクトップ）
- **記事詳細ページ**
  - `app/articles/[id]/page.tsx` による動的ルーティング
  - 選択した記事の詳細情報を表示
- **ヘッダー／レイアウト**
  - 共通ヘッダーコンポーネント
  - App Router ベースのレイアウト構成（`layout.tsx`）
- **モックデータによる一覧表示**
  - `app/data/mockData.ts` に定義した Article 型データを利用
  - 実運用を想定したフィールド構成（id / title / description / url / publishedAt / source / tags など）

### 今後の拡張予定

- 記事検索（キーワード検索）
- タグによるフィルタリング
- お気に入り（Bookmark）機能
- 外部API（News API / RSS等）との統合
- ページネーション / ソート（公開日／人気順など）
- ダークモード対応

---

## 技術構成（Tech Stack）

- **フレームワーク**: Next.js 16（App Router）
- **言語**: TypeScript
- **スタイリング**: Tailwind CSS v4（ユーティリティファースト）
- **ビルド／開発**:
  - Node.js 18+
  - パッケージマネージャ: pnpm
- **テスト**: Vitest + React Testing Library（セットアップ済 / 必要に応じて拡張）

### 設計上のポイント

- `app/` 配下で **ページ・レイアウト・UIコンポーネント・データ・型定義を明確に分離**
- `app/types/` に Article 型などを定義し、Card/List コンポーネント間で共有
- 将来的な外部API統合に備えて、現在は `mockData.ts` をデータソースとして利用し、  
  データ取得ロジックをUIから切り離しやすい構造にしている

---

## プロジェクト構造（Project Structure）

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
    ├── API_INTEGRATION.md        # API統合ガイド
    └── filter-cases.md           # フィルタリング仕様
```

---

## セットアップ（Setup）

### 前提条件

- Node.js 18.x 以上
- pnpm（推奨）または npm

### インストール

```bash
# リポジトリをクローン
git clone <repository-url>
cd news-curator

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

### Lint / フォーマット

```bash
# ESLint チェック
pnpm lint

# 型チェック
pnpm type-check
```

---

## 開発ガイドライン（Development Guidelines）

### コーディング規約

- **TypeScript**: `any` 禁止、すべての関数に戻り値の型を明示
- **React**: コンポーネントは単一責任、Props は必ず型定義
- **Next.js**: Server Component をデフォルト、Client Component は必要な場合のみ
- **Tailwind CSS**: クラス名の順序を統一（レイアウト → サイズ → スペーシング → 色）

### コミット規約

Conventional Commits 形式を採用:

```
feat: 新機能追加
fix: バグ修正
docs: ドキュメント更新
refactor: リファクタリング
style: コードフォーマット
test: テスト追加・修正
```

---

## ドキュメント（Documentation）

- [API統合ガイド](./docs/api-integration.md) - 外部API統合の手順
- [フィルタリング仕様](./docs/filter-cases.md) - タグフィルタリングの実装仕様

---

## 謝辞（Acknowledgments）

- [Next.js](https://nextjs.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [TypeScript](https://www.typescriptlang.org/)
