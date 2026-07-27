-- 予約の区分（一般予約／新規一般／団体／リッツ予約 など。管理画面から追加・編集・削除可能）
create table if not exists reservation_categories (
  id         uuid primary key default gen_random_uuid(),
  name       text not null,
  is_default boolean not null default false, -- true の区分は予約サイトからの一般予約に自動で使われる
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);
alter table reservation_categories enable row level security;

-- 予約フォーム（匿名ユーザー）・管理画面どちらも一覧を読む必要がある
create policy "public read reservation_categories"
  on reservation_categories for select
  using (true);
create policy "admin all reservation_categories"
  on reservation_categories for all
  using (auth.role() = 'authenticated');

-- 初期区分（無ければ投入。既にあれば何もしない）
insert into reservation_categories (name, is_default, sort_order)
select v.name, v.is_default, v.sort_order
from (values
  ('一般予約（予約サイト）', true,  1),
  ('新規一般',               false, 2),
  ('団体',                   false, 3),
  ('リッツ予約',             false, 4)
) as v(name, is_default, sort_order)
where not exists (select 1 from reservation_categories);

-- reservations に区分を紐づける（削除された区分の履歴が消えないよう set null）
alter table reservations
  add column if not exists category_id uuid references reservation_categories(id) on delete set null;

-- ステータスに「仮予約」を追加
alter table reservations drop constraint if exists reservations_status_check;
alter table reservations add constraint reservations_status_check
  check (status in ('unconfirmed','in_progress','confirmed','completed','cancelled','provisional'));
