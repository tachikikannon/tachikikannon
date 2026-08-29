-- 予約・お問い合わせが削除されたときも編集履歴に記録する。
-- 削除後は行そのものが参照できなくなるため、old_value に削除された行全体の
-- スナップショットを残す（編集ログのような差分だけではなく、何が削除されたか分かるようにする）。
-- Supabase の SQL Editor で1回実行してください。

create or replace function log_admin_activity_delete()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into admin_activity_logs (actor_id, action, target_table, target_id, old_value, new_value)
  values (auth.uid(), 'delete', TG_TABLE_NAME, old.id, to_jsonb(old), null);
  return old;
end;
$$;

create trigger trg_reservations_activity_log_delete
  after delete on reservations
  for each row execute function log_admin_activity_delete();

create trigger trg_contacts_activity_log_delete
  after delete on contacts
  for each row execute function log_admin_activity_delete();
