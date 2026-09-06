-- ============================================================
-- 日光山中禅寺 立木観音 / 日光山温泉寺 — Supabase Schema（完全版）
-- Supabase Dashboard > SQL Editor で、新規プロジェクトに対して実行してください。
--
-- 2026-09-06: これまで機能追加のたびに supabase/migration_*.sql を
-- 個別に作成してきましたが、本体の schema.sql に反映されないまま
-- 溜まっていたため、現在の本番構成を反映する形に作り直しました。
-- 今後このファイルは「今の本番と同じものを作れる」状態を維持することを
-- 目的とし、個々の migration_*.sql は「そのときに何があったか」の記録として
-- 残します（新規構築時にmigration_*.sqlを個別実行する必要はありません）。
--
-- 注意1: 既に本番運用中のプロジェクトに対してはこのファイルを再実行しないでください
-- （create/alterはif not exists等で安全ですが、policyの再作成は既存のものと
--  重複してエラーになる場合があります）。
-- 注意2: capacity_settings テーブルのみ、Supabase Dashboardの画面から直接作成された
-- 経緯があり、正式なmigrationファイルが存在しません。以下の定義はアプリコードが
-- 実際に読み書きしている列（type, max_groups, max_people, buffer_minutes）から
-- 推定した内容です。本番のダッシュボードで一度実際の定義と見比べてから使ってください。
-- ============================================================

-- ============================================================
-- 管理者プロフィール（複数管理者アカウント + ロール制御）
-- 他の多くのテーブルから参照されるため最初に定義する
-- ============================================================
create table if not exists admin_profiles (
  id         uuid primary key references auth.users(id) on delete cascade,
  email      text not null,
  name       text,
  role       text not null,
  is_active  boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table admin_profiles drop constraint if exists admin_profiles_role_check;
alter table admin_profiles add constraint admin_profiles_role_check
  check (role in ('super_admin','admin','reservation_admin','reservation_search_admin','contact_admin','viewer'));

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
create index if not exists idx_admin_activity_logs_target_created on admin_activity_logs(target_table, created_at desc);

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

-- ============================================================
-- お知らせ・ブログ・行事カレンダー
-- ============================================================
create table if not exists news (
  id          uuid primary key default gen_random_uuid(),
  title       text not null,
  title_en    text,
  excerpt     text,
  excerpt_en  text,
  body        text not null default '',
  body_en     text,
  cover_url   text,
  category    text not null default 'お知らせ',
  site        text not null default 'chuzenji' check (site in ('chuzenji','onsenji')),
  attachment_url      text,
  attachment_filename text,
  is_published boolean not null default false,
  published_at timestamptz,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);
create index if not exists idx_news_site on news(site);

create table if not exists posts (
  id          uuid primary key default gen_random_uuid(),
  title       text not null,
  title_en    text,
  slug        text not null unique,
  excerpt     text,
  excerpt_en  text,
  body        text not null,
  body_en     text,
  cover_url   text,
  gallery_urls text[] not null default '{}',
  is_published boolean not null default false,
  published_at timestamptz,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

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

-- 年間行事ページの「こまごました行事」（専用ページを持たない追加行事）
create table if not exists minor_events (
  id          uuid primary key default gen_random_uuid(),
  title       text not null,
  title_en    text,
  slug        text not null unique,
  site        text not null default 'chuzenji' check (site in ('chuzenji','onsenji')),
  month_label text not null,
  month_label_en text,
  date_label  text not null,
  date_label_en  text,
  time_label  text,
  time_label_en  text,
  desc_text   text not null default '',
  desc_text_en text,
  subtitle    text,
  subtitle_en text,
  info_date   text,
  info_date_en text,
  info_time   text,
  info_time_en text,
  info_join   text,
  info_join_en text,
  schedule    text not null default '[]',
  schedule_en text not null default '[]',
  notes       text not null default '[]',
  notes_en    text not null default '[]',
  cover_url   text,
  hero_url    text,
  gallery_urls text[] not null default '{}',
  gallery_placement text not null default 'below' check (gallery_placement in ('above','below')),
  apply_url   text,
  sort_order  int not null default 0,
  is_published boolean not null default false,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);
create index if not exists idx_minor_events_site on minor_events(site);

-- ============================================================
-- サイト文言（キー・バリュー型のページ本文。多言語は "<key>_en" キーで対応）
-- ============================================================
create table if not exists site_content (
  key        text primary key,
  value      text,
  updated_at timestamptz not null default now()
);

-- ============================================================
-- 予約の区分・空き状況の調整
-- ============================================================
create table if not exists reservation_categories (
  id         uuid primary key default gen_random_uuid(),
  name       text not null,
  is_default boolean not null default false, -- true の区分は予約サイトからの一般予約に自動で使われる
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists slot_overrides (
  id          uuid primary key default gen_random_uuid(),
  type        text not null check (type in ('prayer','shakyou','shabutu','jyuzu','zazen')),
  date        date not null,
  time_slot   text not null,
  is_closed   boolean not null default false,
  max_groups  int,
  max_people  int,
  reserved_groups int,
  reserved_people int,
  note        text,
  created_at  timestamptz not null default now(),
  unique (type, date, time_slot)
);

-- 体験種別ごとの1時間帯あたりの受入可能組数・人数・前後バッファ分数。
-- 【推定】Supabase Dashboardの画面から直接作成されたテーブルのため、
-- id・created_at等の有無や正確な制約は未確認。type列がupsertのonConflictキーとして
-- 使われているため一意制約は必須。
create table if not exists capacity_settings (
  type           text primary key check (type in ('prayer','shakyou','shabutu','jyuzu','zazen')),
  max_groups     int not null default 5,
  max_people     int not null default 20,
  buffer_minutes int not null default 0
);

-- ============================================================
-- 予約（護摩祈願 / 写経・写仏・数珠づくり・坐禅）
-- ============================================================
create table if not exists reservations (
  id                uuid primary key default gen_random_uuid(),
  type              text not null,
  date              date not null,
  time_slot         text not null,
  name              text not null,
  name_kana         text not null,
  email             text not null,
  phone             text not null,
  party_size        int not null default 1,
  notes             text,
  status            text not null default 'unconfirmed',
  locale            text not null default 'ja',
  category_id       uuid references reservation_categories(id) on delete set null,
  goma_purpose      text,
  confirmation_email_sent boolean not null default false,
  auto_reply_sent   boolean not null default false,
  assigned_admin_id uuid references admin_profiles(id),
  updated_by        uuid references admin_profiles(id),
  updated_at        timestamptz not null default now(),
  created_at        timestamptz not null default now()
);
alter table reservations drop constraint if exists reservations_type_check;
alter table reservations add constraint reservations_type_check
  check (type in ('prayer','shakyou','shabutu','jyuzu','zazen'));
alter table reservations drop constraint if exists reservations_status_check;
alter table reservations add constraint reservations_status_check
  check (status in ('unconfirmed','in_progress','confirmed','completed','cancelled','pending','provisional'));

-- ============================================================
-- お問い合わせ
-- ============================================================
create table if not exists contacts (
  id                uuid primary key default gen_random_uuid(),
  name              text not null,
  email             text not null,
  subject           text not null,
  message           text not null,
  is_read           boolean not null default false,
  status            text not null default 'unread'
                      check (status in ('unread','checking','replied','completed')),
  source            text not null default 'contact' check (source in ('contact','event_application')),
  auto_reply_sent   boolean not null default false,
  assigned_admin_id uuid references admin_profiles(id),
  updated_by        uuid references admin_profiles(id),
  updated_at        timestamptz not null default now(),
  created_at        timestamptz not null default now()
);

-- ============================================================
-- 代金引換申込（授与品）
-- ============================================================
create table if not exists cod_orders (
  id                uuid primary key default gen_random_uuid(),
  name              text not null,
  name_kana         text not null,
  email             text not null,
  phone             text not null,
  postal_code       text not null,
  address           text not null,
  items             jsonb not null, -- [{ name: string, price: number, quantity: number }]
  total_amount      int not null default 0,
  shipping_fee      int not null default 0,
  notes             text,
  status            text not null default 'unconfirmed'
                      check (status in ('unconfirmed','in_progress','confirmed','shipped','completed','cancelled')),
  auto_reply_sent   boolean not null default false,
  assigned_admin_id uuid references admin_profiles(id),
  updated_by        uuid references admin_profiles(id),
  updated_at        timestamptz not null default now(),
  created_at        timestamptz not null default now()
);

-- ============================================================
-- 各種申請（団体予約・減免・写真使用・取材・諸堂使用など）
-- ============================================================
create table if not exists applications (
  id          uuid primary key default gen_random_uuid(),
  category    text not null,
  name        text not null,
  email       text not null,
  phone       text,
  message     text not null,
  photo_ref   text,
  is_read     boolean not null default false,
  status      text not null default 'unread'
                check (status in ('unread','checking','replied','completed')),
  auto_reply_sent   boolean not null default false,
  assigned_admin_id uuid references admin_profiles(id),
  updated_by        uuid references admin_profiles(id),
  updated_at        timestamptz not null default now(),
  created_at        timestamptz not null default now(),
  company_name    text,
  contact_kana    text,
  postal_code     text,
  address         text,
  address_detail  text,
  mobile          text,
  fax             text,
  attachment_url      text,
  attachment_filename text,
  media_categories text[],
  media_name      text,
  media_content   text,
  publish_date    text,
  interview_formats text[],
  preferred_date_1 text,
  preferred_time_1 text,
  preferred_date_2 text,
  preferred_time_2 text,
  preferred_date_3 text,
  preferred_time_3 text,
  attendee_count  text,
  duration_minutes text,
  request_notes   text,
  visit_date      text,
  group_name      text,
  course_number   text,
  adult_count     text,
  child_count     text,
  student_count   text,
  school_or_company text
);

-- ============================================================
-- 予約不可日・画像ライブラリ
-- ============================================================
create table if not exists blocked_dates (
  id         uuid primary key default gen_random_uuid(),
  date       date not null,
  reason     text not null default '',
  type       text not null default 'all',
  created_at timestamptz not null default now()
);

create table if not exists media (
  id          uuid primary key default gen_random_uuid(),
  filename    text not null,
  storage_path text not null,
  public_url  text not null,
  alt         text,
  size_bytes  int,
  mime_type   text,
  is_lendable boolean not null default false,
  site        text not null default 'chuzenji' check (site in ('chuzenji','onsenji')),
  created_at  timestamptz not null default now()
);

-- ============================================================
-- 公開ページ向けRPC（匿名ユーザーが個人情報を含まない範囲だけ読めるようにする）
-- ============================================================
create or replace function public_reservation_slots(from_date date, to_date date, res_types text[])
returns table (date date, time_slot text, type text, party_size int, category_id uuid)
language sql
security definer
set search_path = public
as $$
  select date, time_slot, type, party_size, category_id
  from reservations
  where date >= from_date and date <= to_date and type = any(res_types);
$$;
grant execute on function public_reservation_slots(date, date, text[]) to anon, authenticated;

create or replace function public_capacity_setting(res_type text)
returns table (max_groups int, max_people int, buffer_minutes int)
language sql
security definer
set search_path = public
as $$
  select max_groups, max_people, buffer_minutes
  from capacity_settings
  where type = res_type
  limit 1;
$$;
grant execute on function public_capacity_setting(text) to anon, authenticated;

-- ============================================================
-- Row Level Security
-- ============================================================
alter table news                 enable row level security;
alter table posts                enable row level security;
alter table events                enable row level security;
alter table minor_events         enable row level security;
alter table site_content         enable row level security;
alter table reservation_categories enable row level security;
alter table slot_overrides       enable row level security;
alter table capacity_settings    enable row level security;
alter table reservations         enable row level security;
alter table contacts             enable row level security;
alter table cod_orders           enable row level security;
alter table applications         enable row level security;
alter table blocked_dates        enable row level security;
alter table media                enable row level security;
alter table admin_profiles       enable row level security;
alter table admin_activity_logs  enable row level security;

-- 公開データは誰でも読める
drop policy if exists "public read news" on news;
create policy "public read news"   on news   for select using (is_published = true);
drop policy if exists "public read posts" on posts;
create policy "public read posts"  on posts  for select using (is_published = true);
drop policy if exists "public read events" on events;
create policy "public read events" on events for select using (true);
drop policy if exists "public read minor_events" on minor_events;
create policy "public read minor_events" on minor_events for select using (is_published = true);
drop policy if exists "public read site_content" on site_content;
create policy "public read site_content" on site_content for select using (true);
drop policy if exists "public read reservation_categories" on reservation_categories;
create policy "public read reservation_categories" on reservation_categories for select using (true);
drop policy if exists "public read slot_overrides" on slot_overrides;
create policy "public read slot_overrides" on slot_overrides for select using (true);
drop policy if exists "public read blocked_dates" on blocked_dates;
create policy "public read blocked_dates" on blocked_dates for select using (true);
drop policy if exists "public read lendable media" on media;
create policy "public read lendable media" on media for select using (is_lendable = true);
-- capacity_settingsは直接の公開読み取りポリシーを設けず、public_capacity_setting()経由でのみ公開する

-- 匿名ユーザーからのINSERT
drop policy if exists "public insert reservations" on reservations;
create policy "public insert reservations" on reservations for insert with check (true);
drop policy if exists "public insert contacts" on contacts;
create policy "public insert contacts"     on contacts     for insert with check (true);
drop policy if exists "public insert cod_orders" on cod_orders;
create policy "public insert cod_orders" on cod_orders for insert with check (true);
drop policy if exists "public insert applications" on applications;
create policy "public insert applications" on applications for insert with check (true);

-- 管理者（ログイン済み）はロール区別なく全操作可能なテーブル
drop policy if exists "admin all news" on news;
create policy "admin all news"         on news         for all using (auth.role() = 'authenticated');
drop policy if exists "admin all posts" on posts;
create policy "admin all posts"        on posts        for all using (auth.role() = 'authenticated');
drop policy if exists "admin all events" on events;
create policy "admin all events"       on events       for all using (auth.role() = 'authenticated');
drop policy if exists "admin all minor_events" on minor_events;
create policy "admin all minor_events" on minor_events for all using (auth.role() = 'authenticated');
drop policy if exists "admin all site_content" on site_content;
create policy "admin all site_content" on site_content for all using (auth.role() = 'authenticated');
drop policy if exists "admin all reservation_categories" on reservation_categories;
create policy "admin all reservation_categories" on reservation_categories for all using (auth.role() = 'authenticated');
drop policy if exists "admin all slot_overrides" on slot_overrides;
create policy "admin all slot_overrides" on slot_overrides for all using (auth.role() = 'authenticated');
drop policy if exists "admin all blocked_dates" on blocked_dates;
create policy "admin all blocked_dates" on blocked_dates for all using (auth.role() = 'authenticated');
drop policy if exists "admin all media" on media;
create policy "admin all media"        on media        for all using (auth.role() = 'authenticated');
drop policy if exists "admin all capacity_settings" on capacity_settings;
create policy "admin all capacity_settings" on capacity_settings for all using (auth.role() = 'authenticated');

-- reservations: ロール別（super_admin/admin/reservation_admin/reservation_search_admin/contact_admin/viewer）
drop policy if exists "admin select reservations" on reservations;
create policy "admin select reservations" on reservations for select
  using (current_admin_role() in ('super_admin','admin','reservation_admin','reservation_search_admin','contact_admin','viewer'));
drop policy if exists "admin write reservations" on reservations;
create policy "admin write reservations" on reservations for insert
  with check (current_admin_role() in ('super_admin','admin','reservation_admin','reservation_search_admin'));
drop policy if exists "admin update reservations" on reservations;
create policy "admin update reservations" on reservations for update
  using (current_admin_role() in ('super_admin','admin','reservation_admin','reservation_search_admin'))
  with check (current_admin_role() in ('super_admin','admin','reservation_admin','reservation_search_admin'));
drop policy if exists "admin delete reservations" on reservations;
create policy "admin delete reservations" on reservations for delete
  using (current_admin_role() in ('super_admin','admin','reservation_admin','reservation_search_admin'));

-- contacts: ロール別（super_admin/admin/reservation_admin(閲覧のみ)/contact_admin/viewer）
drop policy if exists "admin select contacts" on contacts;
create policy "admin select contacts" on contacts for select
  using (current_admin_role() in ('super_admin','admin','reservation_admin','contact_admin','viewer'));
drop policy if exists "admin write contacts" on contacts;
create policy "admin write contacts" on contacts for insert
  with check (current_admin_role() in ('super_admin','admin','contact_admin'));
drop policy if exists "admin update contacts" on contacts;
create policy "admin update contacts" on contacts for update
  using (current_admin_role() in ('super_admin','admin','contact_admin'))
  with check (current_admin_role() in ('super_admin','admin','contact_admin'));
drop policy if exists "admin delete contacts" on contacts;
create policy "admin delete contacts" on contacts for delete
  using (current_admin_role() in ('super_admin','admin','contact_admin'));

-- cod_orders / applications: super_admin/admin(書込)、+viewer(閲覧のみ)
drop policy if exists "admin select cod_orders" on cod_orders;
create policy "admin select cod_orders" on cod_orders for select
  using (current_admin_role() in ('super_admin','admin','viewer'));
drop policy if exists "admin write cod_orders" on cod_orders;
create policy "admin write cod_orders" on cod_orders for insert
  with check (current_admin_role() in ('super_admin','admin'));
drop policy if exists "admin update cod_orders" on cod_orders;
create policy "admin update cod_orders" on cod_orders for update
  using (current_admin_role() in ('super_admin','admin'))
  with check (current_admin_role() in ('super_admin','admin'));
drop policy if exists "admin delete cod_orders" on cod_orders;
create policy "admin delete cod_orders" on cod_orders for delete
  using (current_admin_role() in ('super_admin','admin'));

drop policy if exists "admin select applications" on applications;
create policy "admin select applications" on applications for select
  using (current_admin_role() in ('super_admin','admin','viewer'));
drop policy if exists "admin write applications" on applications;
create policy "admin write applications" on applications for insert
  with check (current_admin_role() in ('super_admin','admin'));
drop policy if exists "admin update applications" on applications;
create policy "admin update applications" on applications for update
  using (current_admin_role() in ('super_admin','admin'))
  with check (current_admin_role() in ('super_admin','admin'));
drop policy if exists "admin delete applications" on applications;
create policy "admin delete applications" on applications for delete
  using (current_admin_role() in ('super_admin','admin'));

-- admin_profiles: アクティブな職員なら誰でも一覧を見られる（担当者プルダウン用）。
-- 追加・編集・ロール変更・停止は super_admin のみ。
drop policy if exists "admin_profiles read" on admin_profiles;
create policy "admin_profiles read"  on admin_profiles for select using (current_admin_role() is not null);
drop policy if exists "admin_profiles write" on admin_profiles;
create policy "admin_profiles write" on admin_profiles for all
  using (current_admin_role() = 'super_admin')
  with check (current_admin_role() = 'super_admin');

-- admin_activity_logs: 閲覧はsuper_adminのみ。書き込みは本人のログイン/ログアウトのみ
-- （ステータス変更・担当者変更・編集・削除ログはトリガー経由でのみ書き込まれ、クライアントから偽装不可）
drop policy if exists "admin_activity_logs read" on admin_activity_logs;
create policy "admin_activity_logs read" on admin_activity_logs for select
  using (current_admin_role() = 'super_admin');
drop policy if exists "admin_activity_logs self insert" on admin_activity_logs;
create policy "admin_activity_logs self insert" on admin_activity_logs for insert
  with check (auth.uid() = actor_id and action in ('login','logout'));

-- ============================================================
-- Storage バケット（Dashboard > Storage でも作成可能）
-- ============================================================
insert into storage.buckets (id, name, public, file_size_limit)
values ('temple-images', 'temple-images', true, 20971520) -- 20MB。管理画面からの画像・PDF添付用
on conflict (id) do update set public = true, file_size_limit = 20971520;

drop policy if exists "public read images" on storage.objects;
create policy "public read images"
  on storage.objects for select
  using (bucket_id = 'temple-images');

drop policy if exists "admin upload images" on storage.objects;
create policy "admin upload images"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'temple-images');

drop policy if exists "admin update images" on storage.objects;
create policy "admin update images"
  on storage.objects for update
  to authenticated
  using (bucket_id = 'temple-images')
  with check (bucket_id = 'temple-images');

drop policy if exists "admin delete images" on storage.objects;
create policy "admin delete images"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'temple-images');

-- 申請フォームからのPDF添付用バケット（匿名ユーザーがアップロードできる必要があるため、
-- temple-images（管理者専用）とは別バケットにする）
insert into storage.buckets (id, name, public)
values ('application-attachments', 'application-attachments', true)
on conflict (id) do update set public = true;

drop policy if exists "public upload application attachments" on storage.objects;
create policy "public upload application attachments"
  on storage.objects for insert
  with check (bucket_id = 'application-attachments');

drop policy if exists "public read application attachments" on storage.objects;
create policy "public read application attachments"
  on storage.objects for select
  using (bucket_id = 'application-attachments');

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

drop trigger if exists trg_reservations_updated_meta on reservations;
create trigger trg_reservations_updated_meta
  before update on reservations
  for each row execute function set_updated_meta();

drop trigger if exists trg_contacts_updated_meta on contacts;
create trigger trg_contacts_updated_meta
  before update on contacts
  for each row execute function set_updated_meta();

drop trigger if exists trg_applications_updated_meta on applications;
create trigger trg_applications_updated_meta
  before update on applications
  for each row execute function set_updated_meta();

drop trigger if exists trg_cod_orders_updated_meta on cod_orders;
create trigger trg_cod_orders_updated_meta
  before update on cod_orders
  for each row execute function set_updated_meta();

-- 2つのjsonbを比較し、aの中でbと値が異なるキーだけを集めたjsonbを返す
-- （log_admin_activityで「変更されたフィールドだけ」を記録するための補助関数）
create or replace function admin_activity_jsonb_diff(a jsonb, b jsonb)
returns jsonb
language sql
immutable
as $$
  select coalesce(jsonb_object_agg(key, value), '{}'::jsonb)
  from jsonb_each(a) as x(key, value)
  where a->key is distinct from b->key
$$;

create or replace function log_admin_activity()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  old_rest jsonb;
  new_rest jsonb;
  old_diff jsonb;
  new_diff jsonb;
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

  -- ステータス／担当者／既読フラグ以外のフィールド（日時・氏名・連絡先・メモ等）の編集を記録
  old_rest := to_jsonb(old) - 'updated_at' - 'updated_by' - 'status' - 'assigned_admin_id' - 'is_read';
  new_rest := to_jsonb(new) - 'updated_at' - 'updated_by' - 'status' - 'assigned_admin_id' - 'is_read';
  old_diff := admin_activity_jsonb_diff(old_rest, new_rest);
  new_diff := admin_activity_jsonb_diff(new_rest, old_rest);
  if old_diff <> '{}'::jsonb then
    insert into admin_activity_logs (actor_id, action, target_table, target_id, old_value, new_value)
    values (auth.uid(), 'edit', TG_TABLE_NAME, new.id, old_diff, new_diff);
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

drop trigger if exists trg_applications_activity_log on applications;
create trigger trg_applications_activity_log
  after update on applications
  for each row execute function log_admin_activity();

-- 削除時は行が消えて後から参照できなくなるため、old_value に行全体のスナップショットを残す
-- （編集ログのように差分だけでなく、削除された予約/お問い合わせが何だったか分かるようにする）
create or replace function log_admin_activity_delete()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into admin_activity_logs (actor_id, action, target_table, target_id, old_value, new_value)
  values (auth.uid(), 'delete', TG_TABLE_NAME, old.id, to_jsonb(old), null);
  return old;
end;
$$;

drop trigger if exists trg_reservations_activity_log_delete on reservations;
create trigger trg_reservations_activity_log_delete
  after delete on reservations
  for each row execute function log_admin_activity_delete();

drop trigger if exists trg_contacts_activity_log_delete on contacts;
create trigger trg_contacts_activity_log_delete
  after delete on contacts
  for each row execute function log_admin_activity_delete();

-- ============================================================
-- 初期データ（無ければ投入。既にあれば何もしない）
-- ============================================================
insert into reservation_categories (name, is_default, sort_order)
select v.name, v.is_default, v.sort_order
from (values
  ('一般予約（予約サイト）', true,  1),
  ('新規一般',               false, 2),
  ('団体',                   false, 3),
  ('リッツ予約',             false, 4)
) as v(name, is_default, sort_order)
where not exists (select 1 from reservation_categories);

insert into capacity_settings (type, max_groups, max_people, buffer_minutes)
values ('prayer', 5, 20, 59)
on conflict (type) do nothing;
insert into capacity_settings (type, max_groups, max_people, buffer_minutes)
values ('zazen', 5, 20, 0)
on conflict (type) do nothing;
