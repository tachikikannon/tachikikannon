-- ============================================================
-- お問い合わせと行事申込みを区別するための source 列を追加
-- Supabase Dashboard > SQL Editor で実行してください。
-- ============================================================

alter table contacts add column if not exists source text not null default 'contact'
  check (source in ('contact','event_application'));
