-- ============================================================
-- 管理者ロールの追加: reservation_search_admin（予約検索・予約スケジュールのみ操作可能）
-- Supabase Dashboard > SQL Editor で上から順に実行してください。
-- 既存の super_admin / admin / reservation_admin / contact_admin / viewer
-- ユーザーの挙動は変わりません（追加のみ）。
--
-- reservation_admin との違い: reservation_admin は予約検索・予約スケジュールに
-- 加えて空き状況設定・予約区分・予約不可日・定員設定も操作できるが、
-- reservation_search_admin はアプリ側（サイドバー・ミドルウェア）で
-- 「予約検索」「予約スケジュール」の2画面のみに制限される。
-- reservations テーブルへの読み書き権限自体は reservation_admin と同じにする
-- （予約の検索・確認・編集・スケジュール登録に必要なため）。
-- ============================================================

-- Step 1: admin_profiles.role の許可値に新ロールを追加
alter table admin_profiles drop constraint if exists admin_profiles_role_check;
alter table admin_profiles add constraint admin_profiles_role_check
  check (role in ('super_admin','admin','reservation_admin','reservation_search_admin','contact_admin','viewer'));

-- Step 2: reservations の閲覧・書き込みポリシーに reservation_search_admin を追加
drop policy if exists "admin select reservations" on reservations;
create policy "admin select reservations" on reservations for select
  using (current_admin_role() in ('super_admin','admin','reservation_admin','reservation_search_admin','contact_admin','viewer'));

drop policy if exists "admin write reservations" on reservations;
create policy "admin write reservations" on reservations for insert
  with check (current_admin_role() in ('super_admin','admin','reservation_admin','reservation_search_admin'));

drop policy if exists "admin update reservations" on reservations;
create policy "admin update reservations" on reservations for update
  using (current_admin_role() in ('super_admin','admin','reservation_admin','reservation_search_admin'))
  with check (current_admin_role() in ('super_admin','admin','reservation_admin','reservation_search_admin'));

drop policy if exists "admin delete reservations" on reservations;
create policy "admin delete reservations" on reservations for delete
  using (current_admin_role() in ('super_admin','admin','reservation_admin','reservation_search_admin'));
