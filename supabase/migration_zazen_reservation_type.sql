-- 新しい体験種別「坐禅」を予約システムに追加する。
-- 料金2,000円・所要時間20分・13:00から30分刻み（受付終了時刻は数珠づくりと同じ季節連動）。
alter table reservations drop constraint if exists reservations_type_check;
alter table reservations add constraint reservations_type_check
  check (type in ('prayer','shakyou','shabutu','jyuzu','zazen'));

alter table slot_overrides drop constraint if exists slot_overrides_type_check;
alter table slot_overrides add constraint slot_overrides_type_check
  check (type in ('prayer','shakyou','shabutu','jyuzu','zazen'));

-- 定員設定の初期値（未設定の場合、管理画面「定員設定」で保存されるまでは
-- 空き状況の判定に反映されないため、あらかじめ投入しておく）。
insert into capacity_settings (type, max_groups, max_people, buffer_minutes)
values ('zazen', 5, 20, 0)
on conflict (type) do nothing;
