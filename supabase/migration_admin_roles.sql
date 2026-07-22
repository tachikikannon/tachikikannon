-- ============================================================
-- 複数管理者アカウント + ロール制御 + LINE通知 用マイグレーション
-- Supabase Dashboard > SQL Editor で「上から順に」実行してください。
-- これは schema.sql と違い一度きりのマイグレーションです（再実行しないこと）。
--
-- 重要: 必ず Step 1〜4 を実行して動作確認した後に Step 5 を実行してください。
-- Step 5（RLS入れ替え）を先に実行すると、admin_profiles が空の間は
-- 既存の管理者全員がログインできなくなります。
-- ============================================================


-- ============================================================
-- Step 1: 新規テーブル・ヘルパー関数（追加のみ・無リスク）
-- ============================================================

create table if not exists admin_profiles (
  id         uuid primary key references auth.users(id) on delete cascade,
  email      text not null,
  name       text,
  role       text not null check (role in ('super_admin','admin','viewer')),
  is_active  boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists admin_activity_logs (
  id           uuid primary key default gen_random_uuid(),
  actor_id     uuid references auth.users(id),
  action       text not null,
  target_table text,
  target_id    uuid,
  old_value    jsonb,
  new_value    jsonb,
  created_at   timestamptz not null default now()
);

-- 現在ログイン中のユーザーのロールを返すヘルパー関数。
-- security definer + テーブルオーナー実行のため、admin_profiles 自体の RLS には
-- 引っかからない（再帰しない）。search_path を固定して search_path 汚染を防止。
create or replace function current_admin_role()
returns text
language sql
stable
security definer
set search_path = public
as $$
  select role from admin_profiles where id = auth.uid() and is_active = true
$$;


-- ============================================================
-- Step 2: 既存ユーザーのバックフィル（Step 5 より必ず先に実行し、確認すること）
-- ============================================================
-- 今日時点でログインできる人は全員フル管理者として動いているため、
-- 既存の auth.users を全員 super_admin として admin_profiles に登録する。
-- （後から /admin/users で個別に admin / viewer へ降格できます）

insert into admin_profiles (id, email, name, role, is_active)
select id, email, split_part(email, '@', 1), 'super_admin', true
from auth.users
on conflict (id) do nothing;

-- ▼ここで一度、admin_profiles に既存ユーザー全員が入っていることを確認してください:
-- select * from admin_profiles;


-- ============================================================
-- Step 3: reservations / contacts へのカラム追加（追加のみ）
-- ============================================================

alter table reservations add column if not exists assigned_admin_id uuid references admin_profiles(id);
alter table reservations add column if not exists updated_by        uuid references admin_profiles(id);
alter table reservations add column if not exists updated_at        timestamptz not null default now();

alter table contacts add column if not exists assigned_admin_id uuid references admin_profiles(id);
alter table contacts add column if not exists updated_by        uuid references admin_profiles(id);
alter table contacts add column if not exists updated_at        timestamptz not null default now();
alter table contacts add column if not exists status            text;


-- ============================================================
-- Step 4: ステータス移行（新旧両方の値を許可する形で移行）
-- ============================================================

-- reservations: pending -> unconfirmed へ既存データを寄せつつ、
-- 移行期間中はコード側がまだ 'pending' を送ってくる可能性があるため
-- 制約には 'pending' も残しておく（後日 Step 4-2 で外す）。
update reservations set status = 'unconfirmed' where status = 'pending';

alter table reservations drop constraint if exists reservations_status_check;
alter table reservations add constraint reservations_status_check
  check (status in ('unconfirmed','in_progress','confirmed','completed','cancelled','pending'));
alter table reservations alter column status set default 'unconfirmed';

-- contacts: is_read (true/false) を新ステータスへ反映。
-- 「既読にしただけ」は「対応済み」ではないため in_read=true は 'checking'（対応中）に寄せる。
update contacts set status = case when is_read then 'checking' else 'unread' end where status is null;

alter table contacts drop constraint if exists contacts_status_check;
alter table contacts add constraint contacts_status_check
  check (status in ('unread','checking','replied','completed'));
alter table contacts alter column status set not null;
alter table contacts alter column status set default 'unread';


-- ============================================================
-- Step 4-2 (任意・後日): 移行が安定した後に 'pending' を許可リストから除外する場合
-- ============================================================
-- alter table reservations drop constraint reservations_status_check;
-- alter table reservations add constraint reservations_status_check
--   check (status in ('unconfirmed','in_progress','confirmed','completed','cancelled'));


-- ============================================================
-- Step 5: RLS 入れ替え（Step 2 のバックフィル確認後のみ実行）
-- ============================================================

alter table admin_profiles       enable row level security;
alter table admin_activity_logs  enable row level security;

-- admin_profiles: アクティブな職員なら誰でも一覧を見られる（担当者プルダウン用）。
-- 追加・編集・ロール変更・停止は super_admin のみ。
create policy "admin_profiles read"   on admin_profiles for select using (current_admin_role() is not null);
create policy "admin_profiles write"  on admin_profiles for all
  using (current_admin_role() = 'super_admin')
  with check (current_admin_role() = 'super_admin');

-- admin_activity_logs: 閲覧は super_admin のみ。
-- 書き込みは「本人によるログイン/ログアウトの自己ログ」のみ許可し、
-- ステータス変更・担当者変更ログはトリガー（テーブル所有者権限）経由でのみ書き込まれる
-- ＝クライアントから偽装・改ざん不可。update/delete ポリシーは用意しない（不変ログ）。
create policy "admin_activity_logs read"  on admin_activity_logs for select
  using (current_admin_role() = 'super_admin');
create policy "admin_activity_logs self insert" on admin_activity_logs for insert
  with check (auth.uid() = actor_id and action in ('login','logout'));

-- reservations / contacts: 既存の "admin all ..." ポリシーを役割別に分割。
-- 既存の公開insertポリシー（with check (true)）はそのまま維持する。
drop policy if exists "admin all reservations" on reservations;
create policy "admin select reservations" on reservations for select
  using (current_admin_role() in ('super_admin','admin','viewer'));
create policy "admin write reservations" on reservations for insert
  with check (current_admin_role() in ('super_admin','admin'));
create policy "admin update reservations" on reservations for update
  using (current_admin_role() in ('super_admin','admin'))
  with check (current_admin_role() in ('super_admin','admin'));
create policy "admin delete reservations" on reservations for delete
  using (current_admin_role() in ('super_admin','admin'));

drop policy if exists "admin all contacts" on contacts;
create policy "admin select contacts" on contacts for select
  using (current_admin_role() in ('super_admin','admin','viewer'));
create policy "admin write contacts" on contacts for insert
  with check (current_admin_role() in ('super_admin','admin'));
create policy "admin update contacts" on contacts for update
  using (current_admin_role() in ('super_admin','admin'))
  with check (current_admin_role() in ('super_admin','admin'));
create policy "admin delete contacts" on contacts for delete
  using (current_admin_role() in ('super_admin','admin'));


-- ============================================================
-- Step 6: トリガー（更新日時の自動記録 + 変更ログの自動記録）
-- ============================================================

create or replace function set_updated_meta()
returns trigger
language plpgsql
as $$
begin
  new.updated_at := now();
  new.updated_by := auth.uid();
  return new;
end;
$$;

drop trigger if exists trg_reservations_updated_meta on reservations;
create trigger trg_reservations_updated_meta
  before update on reservations
  for each row execute function set_updated_meta();

drop trigger if exists trg_contacts_updated_meta on contacts;
create trigger trg_contacts_updated_meta
  before update on contacts
  for each row execute function set_updated_meta();

-- ステータス／担当者の変更のみを検知して活動ログへ記録する（security definer でRLSをバイパス）
create or replace function log_admin_activity()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if old.status is distinct from new.status then
    insert into admin_activity_logs (actor_id, action, target_table, target_id, old_value, new_value)
    values (auth.uid(), 'status_change', TG_TABLE_NAME, new.id,
            jsonb_build_object('status', old.status), jsonb_build_object('status', new.status));
  end if;
  if old.assigned_admin_id is distinct from new.assigned_admin_id then
    insert into admin_activity_logs (actor_id, action, target_table, target_id, old_value, new_value)
    values (auth.uid(), 'assign', TG_TABLE_NAME, new.id,
            jsonb_build_object('assigned_admin_id', old.assigned_admin_id),
            jsonb_build_object('assigned_admin_id', new.assigned_admin_id));
  end if;
  return new;
end;
$$;

drop trigger if exists trg_reservations_activity_log on reservations;
create trigger trg_reservations_activity_log
  after update on reservations
  for each row execute function log_admin_activity();

drop trigger if exists trg_contacts_activity_log on contacts;
create trigger trg_contacts_activity_log
  after update on contacts
  for each row execute function log_admin_activity();


-- ============================================================
-- Step 7: 管理者追加・編集・停止ログ（Server Action から insert される想定）
-- ============================================================
-- admin_profiles への insert/update は super_admin のみ許可されているため
-- （Step 5 の "admin_profiles write" ポリシー）、Server Action は
-- サービスロールキーで動作しこのポリシーをバイパスして admin_activity_logs に
-- 'admin_added' / 'admin_edited' / 'admin_deactivated' を記録します。
-- （このテーブル自体へのポリシーは追加不要 — サービスロールは常にRLSをバイパスするため）
