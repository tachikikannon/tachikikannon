-- /photos（貸出用写真一覧）が常に空になる不具合の修正。
-- media テーブルには公開閲覧ポリシーが無く、匿名アクセスは RLS で
-- ブロックされていた（is_lendable にチェックを入れても反映されなかった原因）。
-- Supabase Dashboard > SQL Editor で実行してください。

create policy "public read lendable media" on media for select using (is_lendable = true);
