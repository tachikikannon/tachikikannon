-- 代金引換申込の送料自動計算に対応するため、算出した送料をそのまま保存する列を追加。
-- total_amount は「商品代金＋送料」の合計に変更（商品代金のみだった過去分の値は変わらない）。
alter table cod_orders add column if not exists shipping_fee int not null default 0;
