-- 授与品の代金引換申込
create table if not exists cod_orders (
  id                uuid primary key default gen_random_uuid(),
  name              text not null,
  name_kana         text not null,
  email             text not null,
  phone             text not null,
  postal_code       text not null,
  address           text not null,
  items             jsonb not null, -- [{ name: string, price: number, quantity: number }]
  total_amount      int not null default 0,
  notes             text,
  status            text not null default 'unconfirmed'
                      check (status in ('unconfirmed','in_progress','confirmed','shipped','completed','cancelled')),
  assigned_admin_id uuid references admin_profiles(id),
  updated_by        uuid references admin_profiles(id),
  updated_at        timestamptz not null default now(),
  created_at        timestamptz not null default now()
);

alter table cod_orders enable row level security;

create policy "public insert cod_orders" on cod_orders for insert with check (true);

create policy "admin select cod_orders" on cod_orders for select
  using (current_admin_role() in ('super_admin','admin','viewer'));
create policy "admin write cod_orders" on cod_orders for insert
  with check (current_admin_role() in ('super_admin','admin'));
create policy "admin update cod_orders" on cod_orders for update
  using (current_admin_role() in ('super_admin','admin'))
  with check (current_admin_role() in ('super_admin','admin'));
create policy "admin delete cod_orders" on cod_orders for delete
  using (current_admin_role() in ('super_admin','admin'));

create trigger trg_cod_orders_updated_meta
  before update on cod_orders
  for each row execute function set_updated_meta();
