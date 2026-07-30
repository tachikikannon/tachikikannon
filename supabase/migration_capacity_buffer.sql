-- 体験予約に「前後何分は他の予約を受け付けない」バッファ設定を追加。
-- 例: 護摩祈祷は1回の御祈祷に約59分かかるため buffer_minutes を59に設定すると、
-- 10:30に予約が入ったとき、10:00・10:30・11:00の枠が自動的に×になる
-- （30分刻みの枠のうち、開始時刻が59分未満しか離れていない枠はすべて時間が重なるため）。
-- Supabase Dashboard > SQL Editor で実行してください。

alter table capacity_settings add column if not exists buffer_minutes int not null default 0;
