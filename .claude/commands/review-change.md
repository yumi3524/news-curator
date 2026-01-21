# /review-change

コードレビューテンプレート

## チェック項目

### 設計
- [ ] Server/Client の適切な使い分け
- [ ] 単一責務
- [ ] 再利用性

### DRY
- [ ] 3箇所以上の重複なし
- [ ] 既存ユーティリティ活用

### 型安全
- [ ] `any` 不使用
- [ ] Props/戻り値に型定義

### セキュリティ
- [ ] 入力サニタイズ
- [ ] 秘密情報ハードコードなし

## 出力形式

```markdown
## レビュー: [Approved / Request Changes]

| # | 重要度 | カテゴリ | ファイル:行 | 問題 | 提案 |
|---|--------|----------|-------------|------|------|
```

## 自動チェック
```bash
pnpm lint && pnpm type-check && pnpm test
```

## Playwright画面確認
```bash
pnpm test:e2e:ui  # UI付きで画面確認
pnpm test:e2e     # ヘッドレス実行
```
