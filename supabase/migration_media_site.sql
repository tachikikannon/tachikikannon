-- 貸出用写真（media）を立木観音／温泉寺で分けて表示できるようにする。
-- 既存の画像はすべて立木観音のものなので、デフォルトは chuzenji。
-- Supabase Dashboard > SQL Editor で実行してください。

alter table media add column if not exists site text not null default 'chuzenji';
alter table media drop constraint if exists media_site_check;
alter table media add constraint media_site_check check (site in ('chuzenji','onsenji'));
