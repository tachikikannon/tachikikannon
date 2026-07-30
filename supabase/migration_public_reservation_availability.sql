-- お客様向けの予約カレンダー（未ログイン）が、既存の予約状況（定員・重複）を
-- 一切反映できていなかった不具合の修正。
--
-- reservations テーブルには氏名・メール・電話番号などの個人情報が含まれるため、
-- 匿名ユーザー向けの直接の読み取りポリシー(select)は意図的に付与されていない。
-- そのため、公開ページの予約カレンダーが空き状況を計算しようとしても
-- RLSに阻まれて常に「予約ゼロ」として扱われ、実際に埋まっている枠でも
-- ×にならない状態だった（管理画面はログイン済みのため正しく表示されていた）。
--
-- 対策として、日付・時間帯・種別・人数（個人情報を含まない列）だけを返す
-- SECURITY DEFINER 関数を用意し、匿名ユーザーにも実行権限だけを与える。
-- Supabase Dashboard > SQL Editor で実行してください。

create or replace function public_reservation_slots(from_date date, to_date date, res_types text[])
returns table (date date, time_slot text, type text, party_size int)
language sql
security definer
set search_path = public
as $$
  select date, time_slot, type, party_size
  from reservations
  where date >= from_date and date <= to_date and type = any(res_types);
$$;

grant execute on function public_reservation_slots(date, date, text[]) to anon, authenticated;

-- capacity_settings（定員設定）はダッシュボード上で作成されたテーブルでRLS設定が
-- リポジトリ管理外のため、念のため同様にSECURITY DEFINER関数経由で確実に取得できるようにする。
create or replace function public_capacity_setting(res_type text)
returns table (max_groups int, max_people int, buffer_minutes int)
language sql
security definer
set search_path = public
as $$
  select max_groups, max_people, buffer_minutes
  from capacity_settings
  where type = res_type
  limit 1;
$$;

grant execute on function public_capacity_setting(text) to anon, authenticated;
