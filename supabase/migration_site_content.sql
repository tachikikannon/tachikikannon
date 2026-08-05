-- site_content: 既存運用中のキー・バリュー型ページ本文テーブルを
-- マイグレーション管理下に追認する（本番データは変更しない）。
--
-- 多言語対応の命名規則: 英語訳は元のキーに "_en" を付けたキーとして
-- 同じテーブルに追加する（例: hero_title の英語訳は hero_title_en）。
-- 未翻訳のキーは英語ページでも日本語値にフォールバックする
-- （src/lib/site-content.ts の getLocalizedContent を参照）。

create table if not exists site_content (
  key        text primary key,
  value      text,
  updated_at timestamptz not null default now()
);

alter table site_content enable row level security;

drop policy if exists "public read site_content" on site_content;
create policy "public read site_content"
  on site_content for select using (true);

drop policy if exists "admin all site_content" on site_content;
create policy "admin all site_content"
  on site_content for all using (auth.role() = 'authenticated');
