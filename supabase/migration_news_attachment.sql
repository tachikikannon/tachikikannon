-- お知らせにPDFチラシを添付できるようにする（既存のtemple-imagesバケットを流用）
-- Supabase Dashboard > SQL Editor で実行してください。

alter table news add column if not exists attachment_url text;
alter table news add column if not exists attachment_filename text;
