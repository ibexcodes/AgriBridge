alter table public.orders
  add column if not exists item_amount numeric(12, 2),
  add column if not exists delivery_fee numeric(12, 2) not null default 0,
  add column if not exists fulfillment_method text not null default 'pickup',
  add column if not exists delivery_area text not null default 'pickup';

update public.orders
set item_amount = total_amount
where item_amount is null;

alter table public.orders
  alter column item_amount set not null;

alter table public.orders
  drop constraint if exists orders_fulfillment_method_check,
  add constraint orders_fulfillment_method_check check (fulfillment_method in ('pickup', 'delivery')),
  drop constraint if exists orders_delivery_area_check,
  add constraint orders_delivery_area_check check (delivery_area in ('pickup', 'same_area', 'different_area')),
  drop constraint if exists orders_delivery_fee_check,
  add constraint orders_delivery_fee_check check (delivery_fee in (0, 50, 150));
