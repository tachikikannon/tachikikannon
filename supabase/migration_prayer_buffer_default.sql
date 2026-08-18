-- 護摩祈祷の前後バッファを有効化する。
-- 護摩祈祷は1回の御祈祷に約59分かかる（枠は30分刻み）ため、buffer_minutesを
-- 59に設定すると、ある枠に予約が入ったとき、その前後の枠が自動的に×になる
-- （migration_capacity_buffer.sqlのコメント参照）。
-- これまでbuffer_minutesが未設定（0=無効）だったため、実際には前後の枠が
-- ふさがっていなかった。
-- Supabase Dashboard > SQL Editor で実行してください。

insert into capacity_settings (type, max_groups, max_people, buffer_minutes)
values ('prayer', 5, 20, 59)
on conflict (type) do update set buffer_minutes = excluded.buffer_minutes;
