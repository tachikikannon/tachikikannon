-- public_reservation_slots に category_id を追加。
-- 「リッツ」区分の数珠づくり予約だけを護摩祈願とクロスブロックし、
-- 一般の数珠づくりの定員には影響させないための判定に使う。
-- Supabase Dashboard > SQL Editor で実行してください。

-- 戻り値の列構成を変更するため、CREATE OR REPLACEの前に一旦DROPする
-- （PostgreSQLは既存関数の戻り値の型をREPLACEでは変更できない）。
drop function if exists public_reservation_slots(date, date, text[]);

create or replace function public_reservation_slots(from_date date, to_date date, res_types text[])
returns table (date date, time_slot text, type text, party_size int, category_id uuid)
language sql
security definer
set search_path = public
as $$
  select date, time_slot, type, party_size, category_id
  from reservations
  where date >= from_date and date <= to_date and type = any(res_types);
$$;

grant execute on function public_reservation_slots(date, date, text[]) to anon, authenticated;
