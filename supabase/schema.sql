-- ============================================================
-- 日光山中禅寺 立木観音 — Supabase Schema
-- Supabase Dashboard > SQL Editor で実行してください
--
-- 注意: これは「新規にSupabaseプロジェクトを作る場合」の完成形です。
-- 既に本番運用しているプロジェクトに対してはこのファイルを再実行しないでください。
-- 複数管理者アカウント・LINE通知の機能を既存の本番プロジェクトへ追加する場合は
-- 代わりに supabase/migration_admin_roles.sql を（この順序で）実行してください。
-- ============================================================

-- お知らせ
create table if not exists news (
  id          uuid primary key default gen_random_uuid(),
  title       text not null,
  excerpt     text,
  body        text not null default '',
  cover_url   text,
  category    text not null default 'お知らせ',
  is_published boolean not null default false,
  published_at timestamptz,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

-- 既存テーブルへのカラム追加（再実行時用）
alter table news add column if not exists excerpt   text;
alter table news add column if not exists cover_url text;

-- ブログ
create table if not exists posts (
  id          uuid primary key default gen_random_uuid(),
  title       text not null,
  slug        text not null unique,
  excerpt     text,
  body        text not null,
  cover_url   text,
  is_published boolean not null default false,
  published_at timestamptz,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

-- 行事カレンダー
create table if not exists events (
  id          uuid primary key default gen_random_uuid(),
  title       text not null,
  description text,
  start_date  date not null,
  end_date    date,
  all_day     boolean not null default true,
  color       text default '#1a2a4a',
  created_at  timestamptz not null default now()
);

-- ============================================================
-- 管理者プロフィール（複数管理者アカウント + ロール制御）
-- reservations/contacts から参照されるため先に定義する
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

-- ログイン中ユーザーのロールを返すヘルパー（RLSから参照。テーブルオーナー実行のため再帰しない）
create or replace function current_admin_role()
returns text
language sql
stable
security definer
set search_path = public
as $$
  select role from admin_profiles where id = auth.uid() and is_active = true
$$;

-- 予約（護摩祈願 / 写経・写仏）
create table if not exists reservations (
  id                uuid primary key default gen_random_uuid(),
  type              text not null check (type in ('prayer','shakyou','shabutu','jyuzu')),
  date              date not null,
  time_slot         text not null,
  name              text not null,
  name_kana         text not null,
  email             text not null,
  phone             text not null,
  party_size        int not null default 1,
  notes             text,
  status            text not null default 'unconfirmed'
                      check (status in ('unconfirmed','in_progress','confirmed','completed','cancelled')),
  assigned_admin_id uuid references admin_profiles(id),
  updated_by        uuid references admin_profiles(id),
  updated_at        timestamptz not null default now(),
  created_at        timestamptz not null default now()
);

-- お問い合わせ
create table if not exists contacts (
  id                uuid primary key default gen_random_uuid(),
  name              text not null,
  email             text not null,
  subject           text not null,
  message           text not null,
  is_read           boolean not null default false,
  status            text not null default 'unread'
                      check (status in ('unread','checking','replied','completed')),
  assigned_admin_id uuid references admin_profiles(id),
  updated_by        uuid references admin_profiles(id),
  updated_at        timestamptz not null default now(),
  created_at        timestamptz not null default now()
);

-- 画像ライブラリ（Supabase Storage の補助テーブル）
create table if not exists media (
  id          uuid primary key default gen_random_uuid(),
  filename    text not null,
  storage_path text not null,
  public_url  text not null,
  alt         text,
  size_bytes  int,
  mime_type   text,
  created_at  timestamptz not null default now()
);

-- ============================================================
-- Row Level Security
-- ============================================================

alter table news              enable row level security;
alter table posts             enable row level security;
alter table events            enable row level security;
alter table reservations      enable row level security;
alter table contacts          enable row level security;
alter table media             enable row level security;
alter table admin_profiles    enable row level security;
alter table admin_activity_logs enable row level security;

-- 公開データは誰でも読める
create policy "public read news"   on news   for select using (is_published = true);
create policy "public read posts"  on posts  for select using (is_published = true);
create policy "public read events" on events for select using (true);

-- 予約・お問い合わせはINSERTのみ許可（匿名ユーザー）
create policy "public insert reservations" on reservations for insert with check (true);
create policy "public insert contacts"     on contacts     for insert with check (true);

-- 管理者（ログイン済み）はすべて操作可能（news/posts/events/mediaはロール区別なし）
create policy "admin all news"         on news         for all using (auth.role() = 'authenticated');
create policy "admin all posts"        on posts        for all using (auth.role() = 'authenticated');
create policy "admin all events"       on events       for all using (auth.role() = 'authenticated');
create policy "admin all media"        on media        for all using (auth.role() = 'authenticated');

-- reservations / contacts はロール別に制御（viewerは閲覧のみ、admin/super_adminは書き込み可）
create policy "admin select reservations" on reservations for select
  using (current_admin_role() in ('super_admin','admin','viewer'));
create policy "admin write reservations" on reservations for insert
  with check (current_admin_role() in ('super_admin','admin'));
create policy "admin update reservations" on reservations for update
  using (current_admin_role() in ('super_admin','admin'))
  with check (current_admin_role() in ('super_admin','admin'));
create policy "admin delete reservations" on reservations for delete
  using (current_admin_role() in ('super_admin','admin'));

create policy "admin select contacts" on contacts for select
  using (current_admin_role() in ('super_admin','admin','viewer'));
create policy "admin write contacts" on contacts for insert
  with check (current_admin_role() in ('super_admin','admin'));
create policy "admin update contacts" on contacts for update
  using (current_admin_role() in ('super_admin','admin'))
  with check (current_admin_role() in ('super_admin','admin'));
create policy "admin delete contacts" on contacts for delete
  using (current_admin_role() in ('super_admin','admin'));

-- admin_profiles: アクティブな職員なら誰でも一覧を見られる（担当者プルダウン用）。
-- 追加・編集・ロール変更・停止は super_admin のみ。
create policy "admin_profiles read"  on admin_profiles for select using (current_admin_role() is not null);
create policy "admin_profiles write" on admin_profiles for all
  using (current_admin_role() = 'super_admin')
  with check (current_admin_role() = 'super_admin');

-- admin_activity_logs: 閲覧はsuper_adminのみ。書き込みは本人のログイン/ログアウトのみ
-- （ステータス変更・担当者変更ログはトリガー経由でのみ書き込まれ、クライアントから偽装不可）
create policy "admin_activity_logs read" on admin_activity_logs for select
  using (current_admin_role() = 'super_admin');
create policy "admin_activity_logs self insert" on admin_activity_logs for insert
  with check (auth.uid() = actor_id and action in ('login','logout'));

-- ============================================================
-- Storage バケット（Dashboard > Storage でも作成可能）
-- ============================================================
insert into storage.buckets (id, name, public)
values ('temple-images', 'temple-images', true)
on conflict do nothing;

create policy "public read images"
  on storage.objects for select
  using (bucket_id = 'temple-images');

create policy "admin upload images"
  on storage.objects for insert
  with check (bucket_id = 'temple-images' and auth.role() = 'authenticated');

create policy "admin delete images"
  on storage.objects for delete
  using (bucket_id = 'temple-images' and auth.role() = 'authenticated');

-- 予約不可日
create table if not exists blocked_dates (
  id         uuid primary key default gen_random_uuid(),
  date       date not null,
  reason     text not null default '',
  type       text not null default 'all',
  created_at timestamptz not null default now()
);
alter table blocked_dates enable row level security;
create policy "public read blocked_dates"
  on blocked_dates for select
  using (true);
create policy "admin all blocked_dates"
  on blocked_dates for all
  using (auth.role() = 'authenticated');

-- 貸出可能な写真フラグ（画像ライブラリ）
alter table media add column if not exists is_lendable boolean not null default false;

-- 各種申請（写真使用・貸出許可／境内撮影許可／取材協力依頼など）
create table if not exists applications (
  id          uuid primary key default gen_random_uuid(),
  category    text not null,
  name        text not null,
  email       text not null,
  phone       text,
  message     text not null,
  photo_ref   text,
  is_read     boolean not null default false,
  created_at  timestamptz not null default now()
);
alter table applications enable row level security;
create policy "public insert applications" on applications for insert with check (true);
create policy "admin all applications"     on applications for all using (auth.role() = 'authenticated');

-- ============================================================
-- トリガー: 更新日時/更新者の自動記録、ステータス・担当者変更の活動ログ記録
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

create trigger trg_reservations_updated_meta
  before update on reservations
  for each row execute function set_updated_meta();

create trigger trg_contacts_updated_meta
  before update on contacts
  for each row execute function set_updated_meta();

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

create trigger trg_reservations_activity_log
  after update on reservations
  for each row execute function log_admin_activity();

create trigger trg_contacts_activity_log
  after update on contacts
  for each row execute function log_admin_activity();
