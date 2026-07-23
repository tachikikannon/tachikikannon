-- ============================================================
-- 予約確定メール（自動メール）の送信済みフラグを追加
-- Supabase Dashboard > SQL Editor で実行してください。
-- ============================================================

alter table reservations add column if not exists confirmation_email_sent boolean not null default false;
