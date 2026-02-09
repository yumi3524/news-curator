# Tech Feed – 技術フィード

Qiita と Hacker News の最新技術記事を一覧・閲覧できるキュレーションアプリケーションです。

**🔗 デモ**: [https://tech-feed-zeta.vercel.app/](https://tech-feed-zeta.vercel.app/)

### デスクトップ版
![デスクトップ版スクリーンショット](public/images/demo.png)

## 概要
エンジニアとして興味のある分野の技術情報を効率よく収集したいという自身の課題から開発した個人プロジェクトです。

元々は自分用のツールとして作成し、UX認定の学習で得た手法（ペルソナ設計・Problem Statement・User Journey Map）を適用して改善を進めています。
詳細は [ペルソナ & User Journey Map](./docs/ux/persona.md) を参照してください。

---

## 技術選定理由

| 分野 | 技術 | 選定理由 |
|------|------|----------|
| **Frontend** | Next.js 16 (App Router)<br>React 19<br>TypeScript | Server Components による効率的なデータ取得と、長期運用での責務分離のしやすさを評価。<br>型安全性により、UI が複雑になっても安心してリファクタできる基盤を構築。 |
| **Styling** | Tailwind CSS v4 | 高速かつ整った UI を実装でき、デザイン調整にも柔軟に対応できる点を重視。 |
| **Cache / DB** | Upstash Redis | サーバーレス環境で動作するRedis互換KVストア。記事キャッシュと翻訳キャッシュに使用。 |
| **Translation** | Google Cloud Translation API | Hacker News の英語記事タイトルを自動翻訳。結果はRedisにキャッシュして効率化。 |
| **Package Manager** | pnpm | パッケージ管理が高速かつ安定しており、日々の開発ストレスを減らせるため採用。 |
| **Testing** | Vitest<br>React Testing Library<br>Playwright | Next.js と相性が良く、ユーザー視点の UI テストを自然に書ける環境を重視して採用。 |

---


## 機能（Features）

### 実装済み機能
- **マルチソース対応**: Qiita API v2 と Hacker News API から記事を取得
- **ソース切り替えタブ**: Qiita / Hacker News / All の切り替え表示
- **カテゴリ選択によるパーソナライズ**: フロントエンド、バックエンド、AI/ML、インフラなど7つのカテゴリから選択
- **Hacker News 記事の自動翻訳**: 英語タイトルを日本語に自動翻訳（Google Translation API）
- **Upstash Redis によるキャッシュ**: 記事データと翻訳結果をキャッシュして高速化
- **リッチな情報表示**: 記事の「いいね数」「ストック数」「スコア」「コメント数」を表示
- **注目記事（PICK UP!）**: 特に注目すべき記事をハイライト表示
- **ダークモード**: ワンクリックでライト/ダークテーマを切り替え
- **レスポンシブ UI**: PC・スマホ問わず快適に閲覧できるカード型レイアウト
- **包括的なテスト**: Vitest、React Testing Library、Playwrightによるユニット・E2Eテスト
- **Storybook**: コンポーネントの開発・ドキュメント環境
- **充実したUIフィードバック**: ローディング、エラー、空状態の適切な表示

---

## プロジェクト構造（Project Structure）

```
tech-feed/
├── app/
│   ├── (feed)/           # フィード機能（ルートグループ）
│   │   └── page.tsx      # メインページ
│   ├── api/              # APIルート
│   │   ├── articles/     # 記事取得API
│   │   └── translate/    # 翻訳API
│   ├── components/       # 共通UIコンポーネント
│   │   ├── TechFeed.tsx           # メインフィードコンポーネント
│   │   ├── ArticleCard.tsx        # 記事カード
│   │   ├── Dashboard.tsx          # ダッシュボード
│   │   ├── SourceTabs.tsx         # ソース切り替えタブ
│   │   ├── CategoryBadge.tsx      # カテゴリバッジ
│   │   ├── CategorySelectionModal.tsx  # カテゴリ選択モーダル
│   │   ├── FeaturedArticle.tsx    # 注目記事
│   │   ├── Header.tsx             # ヘッダー
│   │   ├── ThemeSwitcher.tsx      # テーマ切り替え
│   │   ├── LoadingState.tsx       # ローディング表示
│   │   ├── ErrorState.tsx         # エラー表示
│   │   ├── EmptyState.tsx         # 空状態表示
│   │   └── __tests__/             # コンポーネントテスト
│   ├── lib/
│   │   ├── fetchers/     # データ取得ロジック
│   │   │   ├── qiita-api.ts   # Qiita API v2 フェッチャー
│   │   │   ├── hackernews.ts  # Hacker News API フェッチャー
│   │   │   ├── cache.ts       # キャッシュフェッチャー
│   │   │   └── types.ts       # 共通インターフェース
│   │   ├── cache/        # キャッシュ管理
│   │   │   └── redis.ts       # Upstash Redis クライアント
│   │   ├── services/     # 外部サービス連携
│   │   │   └── translation.ts # Google Translation API
│   │   ├── hooks/        # カスタムフック
│   │   │   ├── useCategories.ts   # カテゴリ管理
│   │   │   ├── useFavorites.ts    # お気に入り管理
│   │   │   └── useTranslation.ts  # 翻訳フック
│   │   ├── categoryMapping.ts  # カテゴリ定義
│   │   ├── constants.ts        # 定数定義
│   │   ├── scoring.ts          # 記事スコアリング
│   │   └── utils.ts
│   ├── types/            # 共通型定義
│   ├── globals.css       # グローバルスタイル・テーマ
│   └── layout.tsx        # ルートレイアウト
├── e2e/                  # E2Eテスト（Playwright）
├── .storybook/           # Storybookの設定
└── docs/                 # ドキュメント
```

---

## セットアップ（Setup）

### 前提条件

- Node.js 18.x 以上
- pnpm（推奨）または npm

### 環境変数

`.env.local` ファイルを作成し、以下の環境変数を設定してください。

```bash
# Qiita API（任意: 設定するとレート制限が緩和される）
QIITA_ACCESS_TOKEN=your_qiita_token

# Upstash Redis（任意: 記事キャッシュ・翻訳キャッシュに使用）
KV_REST_API_URL=your_upstash_redis_url
KV_REST_API_TOKEN=your_upstash_redis_token

# Google Cloud Translation API（任意: Hacker News記事の翻訳に使用）
GOOGLE_TRANSLATE_API_KEY=your_google_api_key
```

> **Note**: 環境変数が設定されていない場合も動作しますが、一部機能が制限されます。

### インストール

```bash
# リポジトリをクローン
git clone <repository-url>
cd tech-feed

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

---

## 工夫した点（Key Highlights）

### 1. マルチソース対応とフェッチャーパターン
データフェッチ層を `app/lib/fetchers/` に分離し、`ArticleFetcher` インターフェースを定義。
- **Qiita API v2**: タグ情報や「いいね数」を取得
- **Hacker News API**: 公式 Firebase API を使用してトップストーリーを取得
- 新しいデータソースを追加する際は、フェッチャーを追加するだけで対応可能な設計

### 2. 型安全性と拡張性
- API レスポンスの型 (`ExternalArticle`) と、UI コンポーネントで扱う型を明確に区別して定義
- 各ソースの特性（Qiita の「いいね数」、Hacker News の「スコア」など）を統一的に扱える設計

### 3. Upstash Redis によるキャッシュ戦略
- **記事キャッシュ**: 取得した記事を25時間キャッシュし、API レート制限を回避
- **翻訳キャッシュ**: Google Translation API の結果を30日間キャッシュしてコストを最適化
- Redis未設定時は自動的にフォールバック動作

### 4. Hacker News 記事の自動翻訳
- 英語タイトルを Google Cloud Translation API で日本語に自動翻訳
- 翻訳結果は Redis にキャッシュして API コールを最小化
- キャッシュ保存時に翻訳済みデータを含めることで、2回目以降の読み込みを高速化

### 5. カテゴリベースのパーソナライズ
- 7つのカテゴリ（フロントエンド、バックエンド、AI/ML、インフラ、モバイル、セキュリティ、トレンド）を定義
- 各カテゴリに関連タグを紐付け、選択したカテゴリに基づいて記事をフィルタリング
- 設定は LocalStorage に保存し、次回訪問時も維持

### 6. CI/CD による品質担保
- **GitHub Actions**: main/develop ブランチへのプッシュ・PR時に Lint・型チェック・テストを自動実行
- Vercel との連携により、CI が成功したコードのみデプロイされる仕組みを構築

---

## 謝辞（Acknowledgments）

- [Next.js](https://nextjs.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [TypeScript](https://www.typescriptlang.org/)
- [Upstash](https://upstash.com/)
- [Qiita API](https://qiita.com/api/v2/docs)
- [Hacker News API](https://github.com/HackerNews/API)
