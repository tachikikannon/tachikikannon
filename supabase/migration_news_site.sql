-- ============================================================
-- お知らせ（news）を寺院ごとに分けるための site 列を追加
-- 既存の記事はすべて「立木観音」のお知らせとして扱われるよう
-- デフォルト値を 'chuzenji' にしています。
-- Supabase Dashboard > SQL Editor で実行してください。
-- ============================================================

alter table news add column if not exists site text not null default 'chuzenji'
  check (site in ('chuzenji','onsenji'));

create index if not exists idx_news_site on news(site);
