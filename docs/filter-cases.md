# フィルタ機能テストケース一覧

記事フィルタリング機能のテストケースと期待される動作を記載しています。

## 📋 目次

- [単一フィルタのテストケース](#単一フィルタのテストケース)
- [複合フィルタのテストケース](#複合フィルタのテストケース)
- [エッジケース](#エッジケース)

---

## 単一フィルタのテストケース

### ソースフィルタ

| ケース | 選択ソース | 期待結果 |
|--------|-----------|---------|
| 1つのソース選択 | Tech Blog | Tech Blogの記事のみ表示 |
| 複数ソース選択 | Tech Blog, Dev Community | いずれかのソースの記事を表示 |
| 存在しないソース | NonExistent | 記事なし（空の結果） |
| ソース未選択 | なし | 全記事表示 |

**実装ロジック:** 選択されたソースIDの **いずれかに一致** する記事を表示（OR条件）

### タグフィルタ

| ケース | 選択タグ | 期待結果 |
|--------|---------|---------|
| 1つのタグ選択 | React | Reactタグを含む記事のみ表示 |
| 複数タグ選択 | React, Performance | いずれかのタグを含む記事を表示 |
| 存在しないタグ | NonExistentTag | 記事なし（空の結果） |
| タグ未選択 | なし | 全記事表示 |

**実装ロジック:** 選択されたタグの **いずれかを含む** 記事のみ表示（OR条件）

### キーワード検索

| ケース | キーワード | 期待結果 |
|--------|-----------|---------|
| タイトルに含まれる | パフォーマンス | タイトルに「パフォーマンス」を含む記事 |
| タグに含まれる | JavaScript | タグに「JavaScript」を含む記事 |
| 大文字小文字混在 | REACT | 大文字小文字を区別せず「React」で検索 |
| 空白のみ | "   " | 全記事表示（空白は無視） |
| 該当なし | Vue | 記事なし（空の結果） |
| キーワードなし | "" | 全記事表示 |

**実装ロジック:** タイトル **または** タグに含まれる記事を表示（OR条件、大文字小文字区別なし）

---

## 複合フィルタのテストケース

### 2つのフィルタ組み合わせ

#### ソース + タグ

| ケース | ソース | タグ | 期待結果 |
|--------|-------|------|---------|
| 基本 | Tech Blog | React | Tech Blog の記事 **かつ** React タグを含む記事 |
| 複数ソース + 1タグ | Tech Blog, Dev Community | React | いずれかのソースの記事 **かつ** React タグを含む記事 |
| 1ソース + 複数タグ | Tech Blog | React, JavaScript | Tech Blog の記事 **かつ** 両方のタグを含む記事 |
| 該当なし | TypeScript Weekly | React | 該当する記事なし |

**組み合わせロジック:** ソース条件（OR） **AND** タグ条件（AND）

#### ソース + キーワード

| ケース | ソース | キーワード | 期待結果 |
|--------|-------|-----------|---------|
| 基本 | Tech Blog | React | Tech Blog の記事 **かつ** タイトルまたはタグに「React」を含む |
| 複数ソース | Tech Blog, Dev Community | パフォーマンス | いずれかのソースの記事 **かつ** 「パフォーマンス」を含む |
| 該当なし | TypeScript Weekly | Next.js | 該当する記事なし |

**組み合わせロジック:** ソース条件（OR） **AND** キーワード条件（OR）

#### タグ + キーワード

| ケース | タグ | キーワード | 期待結果 |
|--------|-----|-----------|---------|
| 基本 | React | パフォーマンス | React タグを含む **かつ** 「パフォーマンス」を含む記事 |
| 複数タグ | React, JavaScript | 新機能 | 両方のタグを含む **かつ** 「新機能」を含む記事 |
| 該当なし | TypeScript | React | 該当する記事なし（タグに TypeScript と React の両方は存在しない） |

**組み合わせロジック:** タグ条件（AND） **AND** キーワード条件（OR）

### 3つのフィルタ組み合わせ

#### ソース + タグ + キーワード

| ケース | ソース | タグ | キーワード | 期待結果 |
|--------|-------|------|-----------|---------|
| 基本 | Tech Blog | React | 19 | Tech Blog の記事 **かつ** React タグ **かつ** 「19」を含む記事（記事ID: 1） |
| 複数ソース | Tech Blog, Dev Community | React | パフォーマンス | いずれかのソースの記事 **かつ** React タグ **かつ** 「パフォーマンス」を含む記事 |
| 複数タグ | Tech Blog | React, JavaScript | 新機能 | Tech Blog の記事 **かつ** 両方のタグ **かつ** 「新機能」を含む記事（記事ID: 1） |
| 厳しい条件（該当なし） | TypeScript Weekly | React | Next.js | 該当する記事なし |

**組み合わせロジック:** ソース条件（OR） **AND** タグ条件（AND） **AND** キーワード条件（OR）

---

## エッジケース

### 境界値・特殊ケース

| ケース | 入力 | 期待結果 |
|--------|------|---------|
| 空の記事配列 | フィルタなし | 空の結果 |
| すべてのフィルタが空 | ソース: []<br>タグ: []<br>キーワード: "" | 全記事表示 |
| 空白のみのキーワード | "   " | 全記事表示（トリム後に空文字として扱う） |
| 記事にタグなし | タグフィルタ: React | タグなし記事は除外 |
| 全記事が条件に合致 | ソース: すべて選択 | 全記事表示 |
| 全記事が条件に不一致 | 存在しないキーワード: "Nonexistent" | 記事なし |

---

## テストデータ

### サンプル記事データ

```typescript
[
  {
    id: "1",
    title: "React 19の新機能",
    source: { id: "tech-blog", name: "Tech Blog" },
    tags: ["React", "JavaScript", "Frontend"],
  },
  {
    id: "2",
    title: "Next.js 15のパフォーマンス最適化",
    source: { id: "dev-community", name: "Dev Community" },
    tags: ["Next.js", "Performance", "React"],
  },
  {
    id: "3",
    title: "TypeScript 5.3の新機能",
    source: { id: "typescript-weekly", name: "TypeScript Weekly" },
    tags: ["TypeScript", "JavaScript"],
  },
  {
    id: "4",
    title: "Reactパフォーマンスチューニング",
    source: { id: "tech-blog", name: "Tech Blog" },
    tags: ["React", "Performance"],
  },
]
```

---

## 実装例

### 具体的な使用例

#### 例1: ソース2つ + タグ1つ + キーワード

```typescript
const filters: FilterOptions = {
  selectedSources: ["tech-blog", "dev-community"],
  selectedTags: ["React"],
  searchKeyword: "パフォーマンス",
};

// 期待結果: 記事ID 2, 4
// - 記事2: Dev Community, React, "パフォーマンス"を含む
// - 記事4: Tech Blog, React, "パフォーマンス"を含む
```

#### 例2: タグ2つ

```typescript
const filters: FilterOptions = {
  selectedSources: [],
  selectedTags: ["React", "Performance"],
  searchKeyword: "",
};

// 期待結果: 記事ID 2, 4
// - 両方とも React と Performance の両方のタグを持つ
```

#### 例3: キーワードのみ

```typescript
const filters: FilterOptions = {
  selectedSources: [],
  selectedTags: [],
  searchKeyword: "JavaScript",
};

// 期待結果: 記事ID 1, 3
// - タグに "JavaScript" を含む記事
```

---

## UI動作仕様

### フィルタパネルの動作

1. **チェックボックス（ソース）**
   - 複数選択可能
   - クリックで選択/解除を切り替え
   - 選択されたソースはOR条件で適用

2. **チップボタン（タグ）**
   - 複数選択可能
   - クリックで選択/解除を切り替え
   - 選択時: 青背景・白文字
   - 未選択時: 灰色背景・黒文字
   - 選択されたタグはOR条件で適用

3. **テキスト入力（キーワード）**
   - リアルタイムで検索
   - タイトルとタグを対象に大文字小文字を区別せず検索
   - 空白のみは無視

4. **すべてクリアボタン**
   - フィルタが1つ以上アクティブな場合のみ表示
   - クリックですべてのフィルタをリセット
   - アクティブなフィルタ数を表示

### 結果表示

- 結果件数を表示（例: "3件の記事が見つかりました (全10件中)"）
- 結果が0件の場合は「条件に一致する記事が見つかりませんでした」と表示

---

## 関連ファイル

- **フィルタロジック**: [`app/lib/filterArticles.ts`](../app/lib/filterArticles.ts)
- **ユニットテスト**: [`app/lib/__tests__/filterArticles.test.ts`](../app/lib/__tests__/filterArticles.test.ts)
- **フィルタUIコンポーネント**: [`app/(feed)/_components/FilterPanel.tsx`](../app/(feed)/_components/FilterPanel.tsx)
- **フィードページ**: [`app/(feed)/page.tsx`](../app/(feed)/page.tsx)

---

## 更新履歴

| 日付 | 内容 |
|------|------|
| 2024-11-24 | 初版作成 |
