-- 編集履歴画面（/admin/activity-logs）は target_table で絞り込んで created_at 降順に読むため、
-- ログが増えても遅くならないようにインデックスを追加する。
create index if not exists idx_admin_activity_logs_target_created on admin_activity_logs(target_table, created_at desc);
