-- 予約フォームがどの言語（ja/en）から送信されたかを保存する。
-- 管理画面で「予約確定」にした際の確定メールを、申込時の言語で送るために使う。
-- Supabase Dashboard > SQL Editor で実行してください（既存データには影響しません）。

alter table reservations add column if not exists locale text not null default 'ja';
