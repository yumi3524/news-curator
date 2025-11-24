# ArticleCard コンポーネント

フィード用の記事カードコンポーネント。お気に入り機能を持ち、レスポンシブデザインに対応しています。

## 📁 ファイル構成

```
app/(feed)/_components/
├── ArticleCard.tsx              # コンポーネント本体
├── ArticleCard.stories.tsx      # Storybook
└── __tests__/
    └── ArticleCard.test.tsx     # テストコード
```

## 🎯 機能

- ✅ 記事タイトル（クリックで別タブで開く）
- ✅ ソース名と公開日の表示
- ✅ タグのバッジリスト
- ✅ お気に入りトグルボタン
- ✅ ホバーエフェクト（カードが浮き上がる）
- ✅ レスポンシブデザイン

## 💻 使用方法

### 基本的な使い方

```tsx
import ArticleCard from "@/app/(feed)/_components/ArticleCard";
import { Article } from "@/app/types/types";

function FeedPage() {
  const [articles, setArticles] = useState<Article[]>([]);

  const handleToggleFavorite = (articleId: string) => {
    setArticles((prev) =>
      prev.map((article) =>
        article.id === articleId
          ? { ...article, isFavorite: !article.isFavorite }
          : article
      )
    );
  };

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {articles.map((article) => (
        <ArticleCard
          key={article.id}
          article={article}
          onToggleFavorite={handleToggleFavorite}
        />
      ))}
    </div>
  );
}
```

## 📋 Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `article` | `Article` | ✅ | 記事データ（id, title, url, source, tags, publishedAt, isFavorite） |
| `onToggleFavorite` | `(articleId: string) => void` | ✅ | お気に入りトグル時のコールバック |

### Article 型

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
  isFavorite?: boolean;
}
```

## 🎨 UI設計の意図

### レイアウト

- **カード形式**: 情報を整理して見やすく表示
- **ホバーエフェクト**: 軽く浮き上がることでクリック可能であることを示す
- **お気に入りボタン**: 右上に固定配置し、すぐにアクセスできるようにする

### レスポンシブ対応

- **モバイル（〜640px）**: 縦長のカードで情報を縦に配置
- **タブレット（640px〜）**: 余白を増やし、より快適な閲覧体験
- **デスクトップ（1024px〜）**: グリッドレイアウトで複数カードを並べて表示

### アクセシビリティ

- `aria-label`でお気に入りボタンの状態を明示
- `target="_blank"`と`rel="noopener noreferrer"`で安全な外部リンク
- セマンティックHTML（`<article>`, `<time>`）の使用

## 🧪 テスト

### テストの実行

```bash
# テストの実行（まだ設定が必要）
pnpm test

# テストの監視モード
pnpm test:watch
```

### テストカバレッジ

- ✅ 基本的なレンダリング
- ✅ お気に入りボタンの動作
- ✅ お気に入り状態の表示切り替え
- ✅ 外部リンクの動作
- ✅ タグの表示/非表示

## 📚 Storybook

### Storybookの起動（まだ設定が必要）

```bash
pnpm storybook
```

### 用意されているストーリー

- **Default**: デフォルト状態
- **Favorited**: お気に入り登録済み
- **ManyTags**: タグが多い場合
- **NoTags**: タグがない場合
- **LongTitle**: 長いタイトル
- **Mobile**: モバイル表示
- **Desktop**: デスクトップ表示

## 🔧 必要な依存関係

テストとStorybookを実行するには、以下の依存関係が必要です：

### テスト用

```bash
pnpm add -D vitest @testing-library/react @testing-library/jest-dom @vitejs/plugin-react jsdom
```

### Storybook用

```bash
pnpm dlx storybook@latest init
```

## 📝 実装のポイント

### 1. イベントの伝播制御

お気に入りボタンのクリックイベントが、カード全体のリンククリックと競合しないように`stopPropagation()`を使用しています。

```tsx
const handleFavoriteClick = (e: React.MouseEvent) => {
  e.preventDefault();
  e.stopPropagation();
  onToggleFavorite(article.id);
};
```

### 2. 日付のフォーマット

`Intl.DateTimeFormat`を使用して、日本語形式で日付を表示しています。

```tsx
const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat("ja-JP", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(date);
};
```

### 3. 条件付きレンダリング

タグが空の場合、タグセクション全体を非表示にしています。

```tsx
{article.tags.length > 0 && (
  <div className="mt-auto flex flex-wrap gap-2">
    {/* タグの表示 */}
  </div>
)}
```

## 🚀 今後の拡張案

- [ ] 画像サムネイルの追加
- [ ] 記事の説明文（description）の表示
- [ ] 読了時間の推定表示
- [ ] ソーシャルシェアボタン
- [ ] キーボードショートカット対応
- [ ] アニメーション効果の強化

## 🐛 既知の問題

現在、既知の問題はありません。

## 📄 ライセンス

MIT
