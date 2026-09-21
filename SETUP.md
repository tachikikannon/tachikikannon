# セットアップガイド — 日光山中禅寺 立木観音

## 必要なアカウント（すべて無料プランで開始できます）

| サービス | 用途 | URL |
|---------|------|-----|
| GitHub | コード管理 | github.com |
| Vercel | 公開・ホスティング | vercel.com |
| Supabase | データベース・認証・画像 | supabase.com |

---

## STEP 1 — Supabase のセットアップ

1. https://supabase.com でアカウント作成
2. 「New project」でプロジェクトを作成（名前例：`temple-cms`）
3. **SQL Editor** を開き、`supabase/schema.sql` の内容をすべて貼り付けて実行
   - `supabase/migration_*.sql` は個別に実行する必要はありません（`schema.sql` に統合済み・過去の記録として残しているだけです）
   - ただし `capacity_settings` テーブルだけは元々Supabase Dashboardの画面から直接作成されたものなので、`schema.sql` の定義はコードの利用実態から推定した内容です。実行後、本番の管理画面「定員設定」で値を入れ直してください
4. **Authentication > Users > Add user** で最初の管理者アカウントを作成
   - Email と Password を設定（これが管理画面ログイン情報になります）
5. 同じく **SQL Editor** で、作成したユーザーを最初の super_admin として登録：
   ```sql
   insert into admin_profiles (id, email, name, role, is_active)
   select id, email, '担当者名', 'super_admin', true
   from auth.users where email = '手順4で作成したメールアドレス';
   ```
   （2人目以降の管理者は `/admin/users` 画面からsuper_adminが追加できます）
6. **Project Settings > API** から以下をコピー：
   - `Project URL`
   - `anon public` キー
   - `service_role` キー（`/admin/users` での管理者追加に使用。絶対に公開しない）

---

## STEP 2 — GitHub にコードをアップロード

1. https://github.com でアカウント作成
2. 「New repository」でリポジトリ作成（名前例：`temple-cms`）
3. このフォルダ（`temple-cms`）をリポジトリにアップロード

---

## STEP 3 — Vercel にデプロイ

1. https://vercel.com でアカウント作成（GitHubアカウントでサインイン可）
2. 「New Project」→ GitHub のリポジトリを選択
3. **Environment Variables** に以下を追加：
   ```
   NEXT_PUBLIC_SUPABASE_URL      = （STEP 1 の Project URL）
   NEXT_PUBLIC_SUPABASE_ANON_KEY = （STEP 1 の anon キー）
   SUPABASE_SERVICE_ROLE_KEY     = （STEP 1 の service_role キー）
   RESEND_API_KEY                = （resend.com の API キー）
   NOTIFY_EMAIL                  = （予約・お問い合わせの通知先メールアドレス）
   SITE_URL                      = （このサイトの本番URL。例: https://xxx.vercel.app）
   LINE_CHANNEL_SECRET           = （LINE Developers の チャネルシークレット）
   LINE_CHANNEL_ACCESS_TOKEN     = （LINE Developers の チャネルアクセストークン）
   LINE_RESERVATION_GROUP_ID     = （寺務所LINEグループのgroupId。後述の手順で取得）
   ```
4. 「Deploy」をクリック → 数分でサイトが公開されます

---

## STEP 4 — 管理画面にログイン

公開後、`https://あなたのサイト.vercel.app/admin/login` にアクセス。  
STEP 1 で作成した Email と Password でログインできます。

---

## 独自ドメインの設定（後から設定可能）

1. お名前.com や ムームードメインでドメインを取得
2. Vercel の Dashboard > Settings > Domains でドメインを追加
3. ドメイン会社の DNS 設定に Vercel の指示通り入力
4. 数時間〜24時間でドメインが有効になります

---

## 管理画面でできること

| 機能 | URL |
|------|-----|
| ダッシュボード | /admin |
| お知らせ管理 | /admin/news |
| ブログ管理 | /admin/blog |
| 行事カレンダー | /admin/events |
| 予約管理 | /admin/reservations |
| お問い合わせ | /admin/contacts |
| 画像管理 | /admin/images |
| 管理者管理（super_adminのみ） | /admin/users |

---

## バックアップ（データ・画像をPCに保存）

予約・お問い合わせ・お知らせなどのデータと、アップロードした画像/PDFを、自分のPCに保存します。
Supabaseの無料プランには自動バックアップがないため、定期的に実行してください（目安: 月1回、大きな更新の後）。

### 初回だけ必要な準備

1. Supabaseのダッシュボード → **Project Settings → API** を開き、`service_role`（または Secret key）をコピーします。
2. このフォルダに `.env.backup` というファイルを作り、次の1行を書きます（`.gitignore` で除外済みなのでGitHubには上がりません）。

```
SUPABASE_SERVICE_ROLE_KEY=ここに貼り付け
```

> ⚠️ このキーはデータベースの全権限を持ちます。他人に見せない・チャットやGitHubに貼らない・Vercelの「NEXT_PUBLIC_」付きの変数に入れないでください。

### 実行

```
npm run backup
```

- 保存先: このフォルダの**隣**の `temple-cms-バックアップ`（個人情報を含むため、リポジトリの外に作られます）
  - `data/日付_時刻/` … 全テーブルのJSON（実行のたびに新しいフォルダ）と、管理者アカウント一覧
  - `storage/` … 画像・PDF（差分保存。前回と同じファイルは再ダウンロードしません）
- 実行後の画面で、各テーブルの件数（例: `reservations 120 件`）が実際と大きく違わないか確認してください。
- `✖` が出た場合は、その行のメッセージを確認してください。
- 管理者アカウントのパスワードは保存されません。復旧時は再設定が必要です。
- 保存先には個人情報が含まれます。GitHubや公開の場所には絶対に置かないでください。
