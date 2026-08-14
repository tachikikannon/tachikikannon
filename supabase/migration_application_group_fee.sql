-- 各種申請フォームの拡張（団体予約申請・減免申請）
-- Supabase Dashboard > SQL Editor で実行してください。

alter table applications add column if not exists visit_date text;
alter table applications add column if not exists group_name text;
alter table applications add column if not exists course_number text;
alter table applications add column if not exists adult_count text;
alter table applications add column if not exists child_count text;
alter table applications add column if not exists student_count text;
alter table applications add column if not exists school_or_company text;
