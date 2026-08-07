-- 「こまごました行事」(minor_events) の詳細ページを、観音講などの専用ページと
-- 同じ構成（概要チップ・タイムスケジュール・注意事項）にするための追加カラム。
-- すべて任意項目。未入力ならページ側で該当セクションを表示しないため、
-- 既存の行事データにも影響しません。
-- どの状態から実行しても安全（何度実行してもOK）。
-- Supabase Dashboard > SQL Editor で実行してください。

alter table minor_events add column if not exists subtitle text;
alter table minor_events add column if not exists subtitle_en text;
alter table minor_events add column if not exists info_date text;
alter table minor_events add column if not exists info_date_en text;
alter table minor_events add column if not exists info_time text;
alter table minor_events add column if not exists info_time_en text;
alter table minor_events add column if not exists info_join text;
alter table minor_events add column if not exists info_join_en text;
alter table minor_events add column if not exists schedule text not null default '[]';
alter table minor_events add column if not exists schedule_en text not null default '[]';
alter table minor_events add column if not exists notes text not null default '[]';
alter table minor_events add column if not exists notes_en text not null default '[]';
