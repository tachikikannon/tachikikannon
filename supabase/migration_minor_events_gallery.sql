-- 立木法要／温泉寺法要（旧: こまごました行事）の詳細ページに、
-- ブログのように複数枚の写真ギャラリーを追加し、文章の上・下どちらに
-- 表示するか選べるようにする。
-- Supabase Dashboard > SQL Editor で実行してください。

alter table minor_events add column if not exists gallery_urls text[] not null default '{}';
alter table minor_events add column if not exists gallery_placement text not null default 'below';
alter table minor_events drop constraint if exists minor_events_gallery_placement_check;
alter table minor_events add constraint minor_events_gallery_placement_check check (gallery_placement in ('above','below'));
