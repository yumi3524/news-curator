# nextjs-dev

Next.js + TypeScript 開発

## Server/Client Component
- デフォルト: Server Component（`'use client'` なし）
- Client必須: `useState`, `useEffect`, `onClick` 使用時のみ

## ファイル構造
```
app/
├── (feed)/page.tsx      # ページ
├── components/          # 共有コンポーネント
├── lib/fetchers/        # データ取得
├── lib/hooks/           # カスタムフック
└── types/               # 型定義
```

## データフェッチ
```tsx
// Server Component
const data = await fetch(url, { next: { revalidate: 300 } })

// Client Component
const [data, setData] = useState()
useEffect(() => { fetch('/api/...') }, [])
```

## 型定義
- `any` 禁止 → `unknown` + 型ガード
- Props/戻り値に必ず型付け
- 外部API型 → 内部型への変換関数を用意

## 検証
```bash
pnpm type-check && pnpm lint && pnpm test
```
