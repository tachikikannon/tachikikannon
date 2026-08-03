-- 年間行事ページ（/annual-events, /onsenji/events）に、専用ページを作らない
-- 「こまごました行事」を管理画面から自由に追加できるようにするテーブル。
-- カード写真（cover_url）とヒーロー写真（hero_url）を個別に設定でき、
-- site列で立木観音／温泉寺を分けて管理できる。
-- どの状態から実行しても安全（何度実行してもOK）。
-- Supabase Dashboard > SQL Editor で実行してください。

create table if not exists minor_events (
  id          uuid primary key default gen_random_uuid(),
  title       text not null,
  slug        text not null unique,
  month_label text not null,
  date_label  text not null,
  time_label  text,
  desc_text   text not null default '',
  cover_url   text,
  hero_url    text,
  apply_url   text,
  sort_order  int not null default 0,
  is_published boolean not null default false,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

alter table minor_events add column if not exists site text not null default 'chuzenji';
alter table minor_events drop constraint if exists minor_events_site_check;
alter table minor_events add constraint minor_events_site_check check (site in ('chuzenji','onsenji'));

create index if not exists idx_minor_events_site on minor_events(site);

alter table minor_events enable row level security;

drop policy if exists "public read minor_events" on minor_events;
create policy "public read minor_events" on minor_events for select using (is_published = true);

drop policy if exists "admin all minor_events" on minor_events;
create policy "admin all minor_events" on minor_events for all using (auth.role() = 'authenticated');
