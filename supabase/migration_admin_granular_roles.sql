-- ============================================================
-- 管理者ロールの細分化: reservation_admin（予約担当）/ contact_admin（お問い合わせ担当）を追加
-- Supabase Dashboard > SQL Editor で上から順に実行してください。
-- 既存の super_admin / admin / viewer ユーザーの挙動は変わりません（追加のみ）。
-- ============================================================

-- Step 1: admin_profiles.role の許可値に新ロールを追加
alter table admin_profiles drop constraint if exists admin_profiles_role_check;
alter table admin_profiles add constraint admin_profiles_role_check
  check (role in ('super_admin','admin','reservation_admin','contact_admin','viewer'));

-- Step 2: reservations の書き込みポリシーを reservation_admin にも許可
-- （select=閲覧は全ロール共通のまま。insert/update/delete のみ差し替え）
drop policy if exists "admin write reservations" on reservations;
create policy "admin write reservations" on reservations for insert
  with check (current_admin_role() in ('super_admin','admin','reservation_admin'));

drop policy if exists "admin update reservations" on reservations;
create policy "admin update reservations" on reservations for update
  using (current_admin_role() in ('super_admin','admin','reservation_admin'))
  with check (current_admin_role() in ('super_admin','admin','reservation_admin'));

drop policy if exists "admin delete reservations" on reservations;
create policy "admin delete reservations" on reservations for delete
  using (current_admin_role() in ('super_admin','admin','reservation_admin'));

-- reservations の閲覧は全ロール共通のまま（viewer/reservation_admin/contact_adminも見える）
drop policy if exists "admin select reservations" on reservations;
create policy "admin select reservations" on reservations for select
  using (current_admin_role() in ('super_admin','admin','reservation_admin','contact_admin','viewer'));

-- Step 3: contacts の書き込みポリシーを contact_admin にも許可
drop policy if exists "admin write contacts" on contacts;
create policy "admin write contacts" on contacts for insert
  with check (current_admin_role() in ('super_admin','admin','contact_admin'));

drop policy if exists "admin update contacts" on contacts;
create policy "admin update contacts" on contacts for update
  using (current_admin_role() in ('super_admin','admin','contact_admin'))
  with check (current_admin_role() in ('super_admin','admin','contact_admin'));

drop policy if exists "admin delete contacts" on contacts;
create policy "admin delete contacts" on contacts for delete
  using (current_admin_role() in ('super_admin','admin','contact_admin'));

drop policy if exists "admin select contacts" on contacts;
create policy "admin select contacts" on contacts for select
  using (current_admin_role() in ('super_admin','admin','reservation_admin','contact_admin','viewer'));
