-- 空き状況の詳細設定に「指定枠数を確保する」を追加。
-- 「この時間帯だけ受付を停止する」(is_closed) とは別に、定員の一部だけを
-- 社内・電話予約などのために取り分けておきたいケースに対応する。
-- 実際の空き枠計算では (定員 - reserved_groups/reserved_people) を上限として扱う。
alter table slot_overrides
  add column if not exists reserved_groups int,
  add column if not exists reserved_people int;
