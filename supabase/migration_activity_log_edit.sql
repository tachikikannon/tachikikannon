-- admin_activity_logs: ステータス／担当者変更だけでなく、
-- 予約・お問い合わせの詳細編集（日時・氏名・連絡先・メモ・区分など）も
-- 「誰が・いつ・何を変更したか」記録できるようにする。
-- Supabase の SQL Editor で1回実行してください（既存の log_admin_activity を置き換えます）。

create or replace function admin_activity_jsonb_diff(a jsonb, b jsonb)
returns jsonb
language sql
immutable
as $$
  select coalesce(jsonb_object_agg(key, value), '{}'::jsonb)
  from jsonb_each(a) as x(key, value)
  where a->key is distinct from b->key
$$;

create or replace function log_admin_activity()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  old_rest jsonb;
  new_rest jsonb;
  old_diff jsonb;
  new_diff jsonb;
begin
  if old.status is distinct from new.status then
    insert into admin_activity_logs (actor_id, action, target_table, target_id, old_value, new_value)
    values (auth.uid(), 'status_change', TG_TABLE_NAME, new.id,
            jsonb_build_object('status', old.status), jsonb_build_object('status', new.status));
  end if;
  if old.assigned_admin_id is distinct from new.assigned_admin_id then
    insert into admin_activity_logs (actor_id, action, target_table, target_id, old_value, new_value)
    values (auth.uid(), 'assign', TG_TABLE_NAME, new.id,
            jsonb_build_object('assigned_admin_id', old.assigned_admin_id),
            jsonb_build_object('assigned_admin_id', new.assigned_admin_id));
  end if;

  old_rest := to_jsonb(old) - 'updated_at' - 'updated_by' - 'status' - 'assigned_admin_id' - 'is_read';
  new_rest := to_jsonb(new) - 'updated_at' - 'updated_by' - 'status' - 'assigned_admin_id' - 'is_read';
  old_diff := admin_activity_jsonb_diff(old_rest, new_rest);
  new_diff := admin_activity_jsonb_diff(new_rest, old_rest);
  if old_diff <> '{}'::jsonb then
    insert into admin_activity_logs (actor_id, action, target_table, target_id, old_value, new_value)
    values (auth.uid(), 'edit', TG_TABLE_NAME, new.id, old_diff, new_diff);
  end if;

  return new;
end;
$$;
