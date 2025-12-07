# CI/CD & Branch Protection Setup Guide

このプロジェクトでは GitHub Actions を使用して自動テストを行っています。
`main` ブランチへの品質を保つため、以下の設定を GitHub リポジトリで行うことを推奨します。

## 1. ワークフローについて

`.github/workflows/ci.yml` により、以下のタイミングでテストが実行されます：

- `main` または `develop` ブランチへのプッシュ時
- `main` または `develop` ブランチへのプルリクエスト作成時

実行されるチェック：
1. `pnpm lint` (Lintチェック)
2. `pnpm type-check` (型チェック)
3. `pnpm test` (ユニットテスト)

## 2. マージ制限の設定方法 (Branch Protection Rules)

テストが通らない場合にマージできないようにするには、GitHub 上で設定が必要です。

1. GitHub リポジトリの **Settings** タブを開く
2. 左サイドバーの **Branches** をクリック
3. **Branch protection rules** の **Add branch protection rule** をクリック
4. **Branch name pattern** に `main` と入力
5. 以下の項目にチェックを入れる：
   - [x] **Require status checks to pass before merging**
     - ここにチェックを入れると検索ボックスが表示されるので、ワークフローで実行されるジョブ名（例: `Build & Test`）を検索して選択する
     - **注意**: 初めて設定する場合、まだ一度も CI が実行されていないため検索に出てこないことがあります。その場合は、一度このファイルを GitHub にプッシュしてアクションを実行させてから、再度設定を行ってください。
6. **Create** ボタンをクリックして保存

これで、CI がパスしない限り `main` ブランチにマージできなくなります。
