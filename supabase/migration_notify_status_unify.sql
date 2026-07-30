-- ダッシュボードに届く申込系（申請/お問い合わせ/予約/代金引換）のレイアウトを統一するための変更。
-- 1) applications テーブルに、contacts と同じステータス・担当者・更新日時の仕組みを追加
-- 2) 4テーブルすべてに「自動返信メール送信済み」を記録する auto_reply_sent を追加
-- Supabase Dashboard > SQL Editor で実行してください（既存データには影響しません）。

-- ============================================================
-- 1) applications: contacts と同じステータス管理を追加
-- ============================================================
alter table applications add column if not exists status text not null default 'unread';
alter table applications drop constraint if exists applications_status_check;
alter table applications add constraint applications_status_check
  check (status in ('unread','checking','replied','completed'));

alter table applications add column if not exists assigned_admin_id uuid references admin_profiles(id);
alter table applications add column if not exists updated_by uuid references admin_profiles(id);
alter table applications add column if not exists updated_at timestamptz not null default now();

-- 既存の「ログインしていれば誰でも全操作可」ポリシーを、contacts と同じロール別制御に差し替える
drop policy if exists "admin all applications" on applications;

create policy "admin select applications" on applications for select
  using (current_admin_role() in ('super_admin','admin','viewer'));
create policy "admin write applications" on applications for insert
  with check (current_admin_role() in ('super_admin','admin'));
create policy "admin update applications" on applications for update
  using (current_admin_role() in ('super_admin','admin'))
  with check (current_admin_role() in ('super_admin','admin'));
create policy "admin delete applications" on applications for delete
  using (current_admin_role() in ('super_admin','admin'));

drop trigger if exists trg_applications_updated_meta on applications;
create trigger trg_applications_updated_meta
  before update on applications
  for each row execute function set_updated_meta();

drop trigger if exists trg_applications_activity_log on applications;
create trigger trg_applications_activity_log
  after update on applications
  for each row execute function log_admin_activity();

-- ============================================================
-- 2) 自動返信メール送信済みフラグ（申請・お問い合わせ・予約・代金引換の4テーブル共通）
-- ============================================================
alter table applications  add column if not exists auto_reply_sent boolean not null default false;
alter table contacts      add column if not exists auto_reply_sent boolean not null default false;
alter table cod_orders    add column if not exists auto_reply_sent boolean not null default false;
alter table reservations  add column if not exists auto_reply_sent boolean not null default false;
