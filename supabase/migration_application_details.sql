-- 各種申請フォームの拡張（企業・メディア情報、取材申請、PDF添付）
-- Supabase Dashboard > SQL Editor で実行してください。

-- 既存のapplicationsテーブルに項目を追加（すべてnullable、既存行に影響なし）
alter table applications add column if not exists company_name text;
alter table applications add column if not exists contact_kana text;
alter table applications add column if not exists postal_code text;
alter table applications add column if not exists address text;
alter table applications add column if not exists address_detail text;
alter table applications add column if not exists mobile text;
alter table applications add column if not exists fax text;
alter table applications add column if not exists attachment_url text;
alter table applications add column if not exists attachment_filename text;
alter table applications add column if not exists media_categories text[];
alter table applications add column if not exists media_name text;
alter table applications add column if not exists media_content text;
alter table applications add column if not exists publish_date text;
alter table applications add column if not exists interview_formats text[];
alter table applications add column if not exists preferred_date_1 text;
alter table applications add column if not exists preferred_time_1 text;
alter table applications add column if not exists preferred_date_2 text;
alter table applications add column if not exists preferred_time_2 text;
alter table applications add column if not exists preferred_date_3 text;
alter table applications add column if not exists preferred_time_3 text;
alter table applications add column if not exists attendee_count text;
alter table applications add column if not exists duration_minutes text;
alter table applications add column if not exists request_notes text;

-- 申請フォームからのPDF添付用バケット（匿名ユーザーがアップロードできる必要があるため、
-- temple-images（管理者専用）とは別バケットにする）
insert into storage.buckets (id, name, public)
values ('application-attachments', 'application-attachments', true)
on conflict (id) do update set public = true;

drop policy if exists "public upload application attachments" on storage.objects;
drop policy if exists "public read application attachments" on storage.objects;

create policy "public upload application attachments"
  on storage.objects for insert
  with check (bucket_id = 'application-attachments');

create policy "public read application attachments"
  on storage.objects for select
  using (bucket_id = 'application-attachments');
