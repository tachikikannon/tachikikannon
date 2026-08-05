-- ============================================================
-- お知らせ（news）・ブログ（posts）・こまごました行事（minor_events）を
-- 英語ページ（next-intl の en ロケール）に対応させるための _en 列を追加。
-- 未入力（NULL）の場合は既存の日本語値が表示され続けるため、
-- 過去の記事を翻訳しなくても既存ページの表示は壊れません。
-- どの状態から実行しても安全（何度実行してもOK）。
-- Supabase Dashboard > SQL Editor で実行してください。
-- ============================================================

alter table news add column if not exists title_en text;
alter table news add column if not exists excerpt_en text;
alter table news add column if not exists body_en text;

alter table posts add column if not exists title_en text;
alter table posts add column if not exists excerpt_en text;
alter table posts add column if not exists body_en text;

alter table minor_events add column if not exists title_en text;
alter table minor_events add column if not exists desc_text_en text;
