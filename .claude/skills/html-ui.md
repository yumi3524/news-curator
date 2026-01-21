# html-ui

HTML/CSS/Tailwind UI開発

## Tailwind クラス順序
1. レイアウト: `flex`, `grid`
2. サイズ: `w-`, `h-`
3. スペース: `p-`, `m-`, `gap-`
4. 文字: `text-`, `font-`
5. 色: `bg-`, `border-`
6. 他: `rounded-`, `shadow-`

## レスポンシブ
Mobile First: `sm:` → `md:` → `lg:`

## アクセシビリティ
- `<button>` 使用（`<div onClick>` 禁止）
- `aria-label`, `aria-expanded` 設定
- 画像に `alt` 必須

## アイコン
`lucide-react` のみ使用（カスタムSVG禁止）

```tsx
import { Search } from 'lucide-react'
<Search className="h-5 w-5" />
```
