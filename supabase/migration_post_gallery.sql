-- ブログ記事に複数枚の写真ギャラリーを追加（過去の実績・イベント報告用）
alter table posts add column if not exists gallery_urls text[] not null default '{}';
