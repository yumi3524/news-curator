# News Curator - Claude Code開発ガイド

このドキュメントは、Claude Codeでプロジェクトを開発する際の必須情報です。

## 🚨 MANDATORY: コード生成前の必須確認事項

コード生成を開始する前に、**必ず以下のドキュメントと設定ファイルを確認すること**。

---

## 📚 プロジェクトドキュメント

### ドキュメント (`docs/`)
- [docs/API_INTEGRATION.md](docs/API_INTEGRATION.md) - API統合ガイド（News API、RSS、カスタムAPI統合方法）

### README
- [README.md](README.md) - プロジェクト概要、セットアップ手順、開発ガイドライン

---

## 🏗️ プロジェクト構成

### 技術スタック
- **フレームワーク**: Next.js 16.0.3 (App Router)
- **言語**: TypeScript 5
- **UIライブラリ**: React 19.2.0
- **スタイリング**: Tailwind CSS 4, PostCSS 4
- **パッケージマネージャー**: pnpm

### テスト・品質管理
- **ユニット/コンポーネントテスト**: Vitest 4.0.13 + React Testing Library 16.3.0
- **テスト環境**: jsdom 27.2.0
- **コンポーネント開発**: Storybook 10.0.8
- **Storybookテスト統合**: @storybook/addon-vitest 10.0.8（Playwright）
- **E2Eテスト**: Playwright 1.56.1
- **Lint**: ESLint 9 (Next.js core-web-vitals + TypeScript)
- **フォーマッター**: Prettier 3.6.2 + prettier-plugin-tailwindcss 0.7.1
- **カバレッジ**: @vitest/coverage-v8 4.0.13

### ディレクトリ構造
```
news-curator/
├── app/
│   ├── (feed)/                       # Route group (フィード機能)
│   │   ├── _components/              # フィード専用コンポーネント
│   │   │   ├── ArticleCard.tsx
│   │   │   ├── ArticleCard.stories.tsx
│   │   │   └── __tests__/
│   │   │       └── ArticleCard.test.tsx
│   │   └── page.tsx                  # フィードページ
│   ├── articles/
│   │   └── [id]/
│   │       └── page.tsx              # 記事詳細ページ（動的ルーティング）
│   ├── components/                   # 共通コンポーネント
│   │   ├── ArticleCard.tsx
│   │   ├── ArticleList.tsx
│   │   └── Header.tsx
│   ├── data/
│   │   └── mockData.ts               # モックデータ（現在のデータソース）
│   ├── types/
│   │   └── types.ts                  # TypeScript型定義
│   ├── globals.css                   # グローバルスタイル（Tailwind）
│   ├── layout.tsx                    # ルートレイアウト
│   └── page.tsx                      # ホームページ
├── .storybook/                       # Storybook設定
│   ├── main.ts
│   ├── preview.ts
│   ├── vitest.setup.ts
│   └── storybook.css
├── docs/
│   └── API_INTEGRATION.md
├── public/                           # 静的ファイル
├── vitest.config.ts                  # Vitest設定
├── vitest.setup.ts                   # テスト環境セットアップ
├── tsconfig.json                     # TypeScript設定
├── eslint.config.mjs                 # ESLint設定（flat config）
├── postcss.config.mjs                # PostCSS設定
└── package.json
```

---

## 📋 開発前チェックリスト

1. **設定確認**: `tsconfig.json`, `vitest.config.ts`, `eslint.config.mjs` を確認
2. **型定義確認**: `app/types/types.ts` で既存の型定義を確認
3. **既存コンポーネント確認**: `app/components/`, `app/(feed)/_components/` 内のコンポーネントを確認
4. **データソース確認**: `app/data/mockData.ts` で現在使用中のモックデータ構造を確認
5. **API統合予定確認**: `docs/API_INTEGRATION.md` で将来のAPI統合方針を確認

---

## ✅ コーディング規約

### TypeScript設定 ([tsconfig.json](tsconfig.json))
- **Strict mode**: 有効
- **Path alias**: `@/*` = プロジェクトルート
- **Target**: ES2017
- **Module**: ESNext (bundler resolution)
- **JSX**: react-jsx

### 命名規則 ([README.md](README.md))
- **コンポーネント**: PascalCase
- **関数・変数**: camelCase
- **定数**: UPPER_SNAKE_CASE

### TypeScript原則
- **型定義必須**: すべての関数・変数に型定義を行う
- **型定義ファイル**: `app/types/types.ts` に集約

### コンポーネント原則
- **単一責任**: 各コンポーネントは1つの責務のみを持つ
- **テスト必須**: 新規コンポーネントには対応するテストファイルを作成
- **Storybook**: UIコンポーネントには対応する`.stories.tsx`を作成

### スタイリング原則
- **Tailwind CSS**: ユーティリティクラスを使用
- **Prettier**: Tailwindクラスの自動ソート（prettier-plugin-tailwindcss）

---

## 🧪 テスト設計原則

### テスト構成 ([vitest.config.ts](vitest.config.ts))
Vitestはマルチプロジェクト構成を採用：

1. **Storybookテスト** (name: 'storybook')
   - ブラウザベース（Playwright + Chromium）
   - Stories定義からテスト自動生成
   - Setup: `.storybook/vitest.setup.ts`

2. **コンポーネントテスト** (name: 'components')
   - jsdom環境
   - React Testing Library使用
   - Setup: `vitest.setup.ts`

### テストコマンド ([package.json](package.json))
- `pnpm test` - テスト実行
- `pnpm test:ui` - UIモードでテスト実行
- `pnpm test:coverage` - カバレッジレポート生成

### テストファイル配置
- コンポーネントテスト: `__tests__/` ディレクトリ内に配置
- Storybookテスト: `.stories.tsx` ファイルと同階層

### 基本原則
- **独立性**: 各テストは他のテストに依存しない
- **再現性**: 常に同じ結果を保証
- **意図明確**: テスト名で内容を表現（`describe`/`context`/`it`を明確に）
- **具体性**: `context`は具体的な発生条件を記述
- **日本語推奨**: テストの説明は日本語で記述する

### テストコード作法

#### describe/context/it の書き分け

**重要な区別:**
- **describe**: テスト対象（コンポーネント名、関数名、機能名）
- **context**: テスト状況（「〜の場合」「〜している時」）
- **it**: 期待する具体的結果（「〜すること」「〜となること」）

**✅ 推奨される書き方:**

```typescript
describe('ArticleCard', () => {  // コンポーネント名
  describe('お気に入り機能', () => {  // 機能単位
    context('初期状態の場合', () => {  // テスト状況
      it('お気に入りアイコンが未選択状態で表示されること', () => {
        // テストコード
      });
    });

    context('お気に入り登録済みの場合', () => {
      it('お気に入りアイコンが選択状態で表示されること', () => {
        // テストコード
      });
    });
  });

  describe('表示名の生成', () => {
    context('タイトルのみ設定されている場合', () => {
      it('タイトルのみを表示すること', () => {
        const article = createMockArticle({ title: 'テスト記事' });
        render(<ArticleCard article={article} />);
        expect(screen.getByText('テスト記事')).toBeInTheDocument();
      });
    });

    context('タイトルと説明文が設定されている場合', () => {
      it('タイトルと説明文が両方表示されること', () => {
        const article = createMockArticle({
          title: 'テスト記事',
          description: 'テスト説明文'
        });
        render(<ArticleCard article={article} />);
        expect(screen.getByText('テスト記事')).toBeInTheDocument();
        expect(screen.getByText('テスト説明文')).toBeInTheDocument();
      });
    });
  });
});
```

**❌ 避けるべき書き方:**

```typescript
// ❌ itに条件を書く
it('article.imageUrl が設定されている場合、画像を表示すること', () => {});

// ❌ contextに実装詳細を書く
context('props.isActive === true', () => {});

// ❌ 抽象的な表現
it('正しく動作すること', () => {});
it('期待通りであること', () => {});

// ❌ itとcontextを同じ階層に並べる
describe('Component', () => {
  it('テスト1', () => {});  // ❌
  context('状況A', () => {   // ❌ 混在している
    it('テスト2', () => {});
  });
});

// ✅ 正しい書き方
describe('Component', () => {
  context('状況A', () => {
    it('テスト1', () => {});
  });

  context('状況B', () => {
    it('テスト2', () => {});
  });
});
```

#### contextの対称性

正常ケースも明示的にcontextで囲む：

```typescript
describe('ボタンのクリック処理', () => {
  context('有効なボタンの場合', () => {
    it('onClickが呼ばれること', () => {});
  });

  context('無効なボタンの場合', () => {
    it('onClickが呼ばれないこと', () => {});
  });
});
```

#### テストデータ作成

**ヘルパー関数の活用:**

```typescript
// app/__tests__/helpers/testUtils.ts（推奨）
export const createMockArticle = (overrides = {}) => ({
  id: '1',
  title: 'テスト記事',
  description: 'テスト説明',
  url: 'https://example.com',
  publishedAt: '2024-01-01T00:00:00Z',
  source: { id: 'test', name: 'テストソース' },
  tags: ['React'],
  ...overrides,
});

// テストファイル内
describe('ArticleCard', () => {
  context('画像URLが設定されている場合', () => {
    it('記事画像が表示されること', () => {
      const article = createMockArticle({
        imageUrl: 'https://example.com/image.jpg'
      });
      render(<ArticleCard article={article} />);
      expect(screen.getByRole('img')).toHaveAttribute('src', 'https://example.com/image.jpg');
    });
  });
});
```

#### 禁止事項

```typescript
// ❌ ループでテストを生成
['case1', 'case2'].forEach(testCase => {
  it(`${testCase}のテスト`, () => {});
});

// ❌ モックの値をそのまま検証（無意味なテスト）
const mockFn = vi.fn(() => 'result');
expect(mockFn()).toBe('result');

// ❌ 実装詳細のテスト
expect(component.state.internalValue).toBe(123);

// ✅ ユーザーから見える振る舞いをテスト
expect(screen.getByRole('button')).toHaveTextContent('123');

// ❌ 分岐による条件付きテスト
if (condition) {
  it('テスト', () => {});
}

// ✅ 必要なら describe.skip や it.skip を使用
describe.skip('未実装機能', () => {
  it('テスト', () => {});
});
```

#### DRY原則

テストコードも重複を避ける：

```typescript
// ✅ 共通セットアップをヘルパー化
const renderArticleCard = (articleOverrides = {}, options = {}) => {
  const article = createMockArticle(articleOverrides);
  return render(<ArticleCard article={article} {...options} />);
};

describe('ArticleCard', () => {
  it('タイトルが表示されること', () => {
    renderArticleCard({ title: 'テストタイトル' });
    expect(screen.getByText('テストタイトル')).toBeInTheDocument();
  });

  it('説明文が表示されること', () => {
    renderArticleCard({ description: 'テスト説明' });
    expect(screen.getByText('テスト説明')).toBeInTheDocument();
  });
});

// ✅ beforeEach/afterEachで共通処理
describe('Component', () => {
  beforeEach(() => {
    // 各テスト前の共通処理
  });

  afterEach(() => {
    vi.clearAllMocks(); // モックのクリア
  });
});
```

#### Vitest特有の機能

```typescript
// describe.each（パラメータ化テスト）
// ※通常のループは避けるが、describe.eachは明示的で読みやすいため許容される
describe.each([
  { tag: 'React', color: 'blue' },
  { tag: 'TypeScript', color: 'blue' },
  { tag: 'Next.js', color: 'black' },
])('タグ表示: $tag', ({ tag, color }) => {
  it(`"${tag}"タグが${color}色で表示されること`, () => {
    render(<Tag name={tag} color={color} />);
    expect(screen.getByText(tag)).toHaveClass(`text-${color}-600`);
  });
});

// vi.mock でモジュールをモック
vi.mock('@/app/lib/api', () => ({
  fetchArticles: vi.fn(() => Promise.resolve([createMockArticle()])),
}));

// スパイとモックのクリア
afterEach(() => {
  vi.clearAllMocks();  // すべてのモックをクリア
  vi.resetAllMocks();  // モックの実装もリセット
});
```

---

## 🎨 コンポーネント開発

### Storybook ([package.json](package.json))
- `pnpm storybook` - 開発サーバー起動（ポート6006）
- `pnpm build-storybook` - Storybookビルド

### 利用可能なアドオン
- `@storybook/addon-a11y` - アクセシビリティチェック
- `@storybook/addon-docs` - ドキュメント生成
- `@storybook/addon-vitest` - Vitestテスト統合

---

## 📦 データ管理

### 現在のデータソース
- **場所**: `app/data/mockData.ts`
- **状態**: モックデータを使用中

### 型定義 ([app/types/types.ts](app/types/types.ts))
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

### API統合
現在はモックデータを使用しているが、将来的に外部API統合を想定。
詳細は [docs/API_INTEGRATION.md](docs/API_INTEGRATION.md) を参照。

---

## 🚀 開発コマンド

### 基本コマンド ([package.json](package.json))
- `pnpm dev` - 開発サーバー起動
- `pnpm build` - プロダクションビルド
- `pnpm start` - ビルド後のアプリ起動
- `pnpm lint` - ESLint実行

### テスト・品質管理
- `pnpm test` - Vitestテスト実行
- `pnpm test:ui` - インタラクティブテストUI
- `pnpm test:coverage` - カバレッジレポート

### コンポーネント開発
- `pnpm storybook` - Storybook起動
- `pnpm build-storybook` - Storybookビルド

---

## 🔄 コミット規約 ([README.md](README.md))

Conventional Commits形式を採用：

```
feat: 新機能
fix: バグ修正
docs: ドキュメント更新
style: コードスタイルの変更
refactor: リファクタリング
test: テスト追加・修正
chore: ビルドプロセス等の変更
```

---

## 📝 実装時の注意事項

### ファイル作成前の必須確認
1. **既存ファイル確認**: 同様の機能を持つファイルが存在しないか確認
2. **型定義確認**: `app/types/types.ts` に既存の型定義がないか確認
3. **コンポーネント確認**: 再利用可能なコンポーネントが存在しないか確認

### 新規コンポーネント作成時
1. コンポーネントファイル作成 (`.tsx`)
2. Storyファイル作成 (`.stories.tsx`)
3. テストファイル作成 (`__tests__/*.test.tsx`)
4. 必要に応じて型定義を `app/types/types.ts` に追加

### データ取得実装時
- 現在: `app/data/mockData.ts` から取得
- 将来: `docs/API_INTEGRATION.md` のガイドに従ってAPI統合

---

## 🌐 ローカライゼーション

- **言語**: 日本語 (locale: "ja")
- **UIテキスト**: 日本語を使用
- **日付フォーマット**: ISO 8601形式

---

## 🔍 プロジェクトの現状

### 実装済み機能
- Next.js App Routerによるルーティング
- レスポンシブデザイン
- 記事一覧表示（モックデータ）
- 記事詳細ページ（動的ルーティング）
- ArticleCardコンポーネント（お気に入り機能付き）
- Storybook統合
- Vitestテスト環境

### 今後の拡張予定 ([README.md](README.md))
- 記事の検索機能
- タグによるフィルタリング
- お気に入り機能
- 外部API統合（News API、RSS等）
- ダークモード対応
- ページネーション
- ソート機能（日付、人気度等）

---

## ⚠️ 重要な制約事項

### データソース
- **現在**: `app/data/mockData.ts` のみ
- **API未実装**: バックエンドAPIは未実装
- **環境変数**: `.env.local` は未設定（API統合時に必要）


---

## 📖 参考情報

実装に迷った際は、以下を参照すること：

1. [README.md](README.md) - プロジェクト全体概要
2. [docs/API_INTEGRATION.md](docs/API_INTEGRATION.md) - API統合方法
3. [tsconfig.json](tsconfig.json) - TypeScript設定
4. [vitest.config.ts](vitest.config.ts) - テスト設定
5. [eslint.config.mjs](eslint.config.mjs) - Lint設定
6. [app/types/types.ts](app/types/types.ts) - 型定義
7. 既存コンポーネント - 実装パターンの参考
