-- 画像管理（/admin/images）でのアップロードが
-- "new row violates row-level security policy" で失敗する場合の修正。
-- temple-images バケットとポリシーを、正しい定義で作り直す。
-- Supabase Dashboard > SQL Editor で実行してください。

-- バケットが存在しない場合は作成、存在する場合は public 設定を強制
insert into storage.buckets (id, name, public)
values ('temple-images', 'temple-images', true)
on conflict (id) do update set public = true;

-- 既存のポリシーを一旦削除してから作り直す（ダッシュボードで手動編集されて
-- ズレている可能性があるため、確実に上書きする）
drop policy if exists "public read images" on storage.objects;
drop policy if exists "admin upload images" on storage.objects;
drop policy if exists "admin delete images" on storage.objects;
drop policy if exists "admin update images" on storage.objects;

create policy "public read images"
  on storage.objects for select
  using (bucket_id = 'temple-images');

create policy "admin upload images"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'temple-images');

create policy "admin update images"
  on storage.objects for update
  to authenticated
  using (bucket_id = 'temple-images')
  with check (bucket_id = 'temple-images');

create policy "admin delete images"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'temple-images');
