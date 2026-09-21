-- 申請フォームの添付PDF用バケット(application-attachments)を非公開にする。
--
-- 背景: これまでバケットが公開設定かつ「誰でも読める(select)」ポリシーだったため、
--       サイトの公開キーだけで全申請者のPDFを一覧・ダウンロードできる状態だった。
--
-- 【実行順序（重要）】
--   期限付きリンク対応のコード(管理画面・申請フォーム・通知メール)が本番にデプロイされた
--   「後」に実行すること。先に実行すると、管理画面で添付PDFが開けなくなる。
--
-- 【実行後に必ず確認】
--   1. /apply でPDF付きの申請をテスト送信し、アップロードが成功すること。
--   2. /admin/applications で添付PDFのリンクが開けること。
--   1が失敗する場合は、末尾の「元に戻す」SQLを実行する。
--
-- Supabase ダッシュボード > SQL Editor に貼り付けて実行。何度実行しても安全。

-- 1) バケットを非公開にする（/object/public/... のURLが使えなくなる）
update storage.buckets set public = false where id = 'application-attachments';

-- 2) 誰でも読める(select)ポリシーを削除する（これが一覧・ダウンロードを許していた）
drop policy if exists "public read application attachments" on storage.objects;

-- 3) 読めるのは管理者だけにする（管理画面が期限付きリンクを発行するために必要）
drop policy if exists "admin read application attachments" on storage.objects;
create policy "admin read application attachments"
  on storage.objects for select
  to authenticated
  using (
    bucket_id = 'application-attachments'
    and public.current_admin_role() in ('super_admin','admin','viewer')
  );

-- アップロード用の "public upload application attachments"（insert）はそのまま残す。
-- 申請者は自分のPDFをアップロードできるが、一覧・ダウンロードはできなくなる。

-- ============================================================
-- 【元に戻す】（アップロードが失敗した場合のみ実行）
-- ============================================================
-- update storage.buckets set public = true where id = 'application-attachments';
-- drop policy if exists "admin read application attachments" on storage.objects;
-- create policy "public read application attachments"
--   on storage.objects for select
--   using (bucket_id = 'application-attachments');
