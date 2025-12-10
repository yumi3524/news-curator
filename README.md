# Tech Feed – 技術フィード

最新の技術記事をカード形式で一覧・閲覧できる、フロントエンド特化のキュレーションアプリケーションです。

**🔗 デモ**: [https://news-curator-zeta.vercel.app/](https://news-curator-zeta.vercel.app/)

![アプリのスクリーンショット](public/images/demo.png)


## 概要
AI・Web技術・スタートアップなど、興味のある分野の最新記事をまとめて閲覧できるサービスです。  
「毎朝ニュースを巡回する手間を減らす」「必要な情報だけ効率よく取りに行く」ことを目的に開発しています。

---

## 技術選定理由

| 分野 | 技術 | 選定理由 |
|------|------|----------|
| **Frontend** | Next.js 16 (App Router)<br>React<br>TypeScript | Server Components による効率的なデータ取得と、長期運用での責務分離のしやすさを評価。<br>型安全性により、UI が複雑になっても安心してリファクタできる基盤を構築。 |
| **Styling** | Tailwind CSS v4 | 高速かつ整った UI を実装でき、デザイン調整にも柔軟に対応できる点を重視。 |
| **Package Manager** | pnpm | パッケージ管理が高速かつ安定しており、日々の開発ストレスを減らせるため採用。 |
| **Testing** | Vitest<br>React Testing Library | Next.js と相性が良く、ユーザー視点の UI テストを自然に書ける環境を重視して採用。 |

---


## 機能（Features）

### 実装済み機能
- **Qiita API 連携**: Qiita API v2 を利用して最新記事をサーバーサイドで取得
- **リッチな情報表示**: 記事の「いいね数」「ストック数」を表示して人気度を可視化
- **タグフィルタリング**: 興味のある技術タグ（React, Next.js等）で記事を絞り込み
- **注目記事（PICK UP!）**: 特に注目すべき記事をハイライト表示
- **ダークモード**: ワンクリックでライト/ダークテーマを切り替え
- **レスポンシブ UI**: PC・スマホ問わず快適に閲覧できるカード型レイアウト
- **包括的なテスト**: Vitest、React Testing Library、Playwrightによるユニット・E2Eテスト
- **Storybook**: コンポーネントの開発・ドキュメント環境
- **充実したUIフィードバック**: ローディング、エラー、空状態の適切な表示

### 今後の開発計画 (Roadmap)
詳細は [ROADMAP.md](./ROADMAP.md) をご覧ください。

---

## プロジェクト構造（Project Structure）

```
news-curator/
├── app/
│   ├── (feed)/           # フィード機能（ルートグループ）
│   │   └── page.tsx      # メインページ
│   ├── components/       # 共通UIコンポーネント
│   │   ├── ArticleCard.tsx
│   │   ├── FeaturedArticle.tsx
│   │   ├── FilterSection.tsx
│   │   ├── Header.tsx
│   │   ├── NewsCurator.tsx
│   │   ├── ThemeSwitcher.tsx
│   │   ├── LoadingState.tsx
│   │   ├── ErrorState.tsx
│   │   ├── EmptyState.tsx
│   │   └── __tests__/    # コンポーネントテスト
│   ├── lib/
│   │   ├── fetchers/     # データ取得ロジック（Qiita API等）
│   │   ├── filterArticles.ts
│   │   └── utils.ts
│   ├── types/            # 共通型定義
│   ├── globals.css       # グローバルスタイル・テーマ
│   └── layout.tsx        # ルートレイアウト
├── e2e/                  # E2Eテスト（Playwright）
├── .storybook/           # Storybookの設定
├── public/               # 静的ファイル
└── docs/                 # ドキュメント
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

### テスト

```bash
# ユニットテストの実行
pnpm test

# テストをUIモードで実行
pnpm test:ui

# テストカバレッジの確認
pnpm test:coverage

# E2Eテストの実行
pnpm test:e2e

# E2EテストをUIモードで実行
pnpm test:e2e:ui
```

### Storybook

```bash
# コンポーネントカタログの起動
pnpm storybook

# Storybookのビルド
pnpm build-storybook
```

---

## 開発ワークフロー（Development Workflow）

### CI/CD
GitHub Actions で以下を自動実行：
- **ESLint** によるコード品質チェック
- **TypeScript** の型チェック
- **Vitest + Playwright** によるテスト

詳細: [`.github/workflows/ci.yml`](.github/workflows/ci.yml)

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

- [ROADMAP.md](./ROADMAP.md) - 開発ロードマップ
- [API統合ガイド](./docs/api-integration.md) - 外部API統合の手順
- [フィルタリング仕様](./docs/filter-cases.md) - タグフィルタリングの実装仕様

---

## 工夫した点（Key Highlights）

### 1. Qiita RSS から API v2 への移行と設計判断
初期開発フェーズでは認証不要な RSS フィードを検討しましたが、以下の課題のため API v2 へ移行しました。
- **課題**: RSS フィードでは「タグ情報」が正確に取得できず、フィルタリング機能の実装が困難。また、「いいね数」が取得できない。
- **解決策**: Qiita API (REST) を採用し、タグ配列や `likes_count` を取得するように変更。
- **工夫**: データフェッチ層を `app/lib/fetchers/` に分離し、インターフェース (`ArticleFetcher`) を定義。これにより将来 Zenn などを追加する際も `fetchers/zenn-rss.ts` を追加するだけで対応可能な設計としています。

### 2. 型安全性と拡張性
- API レスポンスの型 (`ExternalArticle`) と、UI コンポーネントで扱う型 (`Article`) を明確に区別して定義。
- これにより、データソースが増えても UI 側の変更を最小限に抑えることができます。

### 3. パフォーマンス最適化
- **Server Components**: 記事データ取得をサーバーサイドで行い、クライアントへのJS転送量を削減。
- **キャッシュ戦略**: API ルートで `revalidate: 300` (5分) を設定し、Qiita API のレート制限 (60回/時) を回避しつつ、高速なレスポンスを実現しました。

### 4. CI/CD による品質担保
- **GitHub Actions**: main/develop ブランチへのプッシュ・PR時に Lint・型チェック・テストを自動実行。
- **デプロイ前チェック**: 本番環境へのデプロイ前に品質を担保し、バグの混入を防止。
- Vercel との連携により、CI が成功したコードのみデプロイされる仕組みを構築。

---

## 謝辞（Acknowledgments）

- [Next.js](https://nextjs.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [TypeScript](https://www.typescriptlang.org/)
