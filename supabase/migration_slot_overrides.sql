-- 時間帯単位の予約枠オーバーライド（この日のこの時間だけ閉鎖／定員を変更）
-- blocked_dates（日単位）・capacity_settings（種別全体）だけでは表現できない
-- 「特定日・特定時間帯だけ」の調整を可能にする。
create table if not exists slot_overrides (
  id          uuid primary key default gen_random_uuid(),
  type        text not null check (type in ('prayer','shakyou','shabutu','jyuzu')),
  date        date not null,
  time_slot   text not null,
  is_closed   boolean not null default false,
  max_groups  int,
  max_people  int,
  note        text,
  created_at  timestamptz not null default now(),
  unique (type, date, time_slot)
);

alter table slot_overrides enable row level security;

-- 予約フォーム（匿名ユーザー）が空き状況を判定するために読み取り可能
create policy "public read slot_overrides"
  on slot_overrides for select
  using (true);

-- 管理者（ログイン済み）は編集可能
create policy "admin all slot_overrides"
  on slot_overrides for all
  using (auth.role() = 'authenticated');
