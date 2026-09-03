-- 「諸堂貸出・貸切申請」で選ぶ「貸出」または「貸切」を保存する。
-- それ以外の申請区分では常にnull。
-- Supabase Dashboard > SQL Editor で実行してください（既存データには影響しません）。

alter table applications add column if not exists venue_use_type text;
