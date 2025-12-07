# Qiita API v2 フェッチャー

## 概要

Qiita REST API v2を利用して記事を取得します。

## RSSフィードと比較したメリット

- 記事の正確なタグ情報を取得可能
- いいね数（likes_count）、ストック数（stocks_count）を取得可能
- ユーザー情報などの詳細データへのアクセス

## API 情報

- **エンドポイント**: https://qiita.com/api/v2/items
- **公式ドキュメント**: https://qiita.com/api/v2/docs

## 使用方法

```typescript
import { QiitaAPIFetcher } from '@/app/lib/fetchers/qiita-api';

const fetcher = new QiitaAPIFetcher();
const articles = await fetcher.fetch({ limit: 20, tag: 'React' });
```

## キャッシュ設定

レート制限対策として、Next.js の revalidate を 300秒（5分間）に設定しています。
