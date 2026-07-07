-- ============================================================
-- 日光山中禅寺 立木観音 — Supabase Schema
-- Supabase Dashboard > SQL Editor で実行してください
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

-- 予約（護摩祈願 / 写経・写仏）
create table if not exists reservations (
  id          uuid primary key default gen_random_uuid(),
  type        text not null check (type in ('prayer','shakyou','shabutu','jyuzu')),
  date        date not null,
  time_slot   text not null,
  name        text not null,
  name_kana   text not null,
  email       text not null,
  phone       text not null,
  party_size  int not null default 1,
  notes       text,
  status      text not null default 'pending' check (status in ('pending','confirmed','cancelled')),
  created_at  timestamptz not null default now()
);

-- お問い合わせ
create table if not exists contacts (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  email       text not null,
  subject     text not null,
  message     text not null,
  is_read     boolean not null default false,
  created_at  timestamptz not null default now()
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

alter table news         enable row level security;
alter table posts        enable row level security;
alter table events       enable row level security;
alter table reservations enable row level security;
alter table contacts     enable row level security;
alter table media        enable row level security;

-- 公開データは誰でも読める
create policy "public read news"   on news   for select using (is_published = true);
create policy "public read posts"  on posts  for select using (is_published = true);
create policy "public read events" on events for select using (true);

-- 予約・お問い合わせはINSERTのみ許可（匿名ユーザー）
create policy "public insert reservations" on reservations for insert with check (true);
create policy "public insert contacts"     on contacts     for insert with check (true);

-- 管理者（ログイン済み）はすべて操作可能
create policy "admin all news"         on news         for all using (auth.role() = 'authenticated');
create policy "admin all posts"        on posts        for all using (auth.role() = 'authenticated');
create policy "admin all events"       on events       for all using (auth.role() = 'authenticated');
create policy "admin all reservations" on reservations for all using (auth.role() = 'authenticated');
create policy "admin all contacts"     on contacts     for all using (auth.role() = 'authenticated');
create policy "admin all media"        on media        for all using (auth.role() = 'authenticated');

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
