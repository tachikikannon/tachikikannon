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
