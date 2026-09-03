-- 護摩祈願（type='prayer'）の内容（御祈願／新車祈祷／安産祈願／七五三祈願／その他）を保存する。
-- 予約フォームの備考欄に文字列で埋め込む方式をやめ、専用カラムで管理・表示するために追加。
-- type='prayer'以外の予約では常にnull。
-- Supabase Dashboard > SQL Editor で実行してください（既存データには影響しません）。

alter table reservations add column if not exists goma_purpose text;
