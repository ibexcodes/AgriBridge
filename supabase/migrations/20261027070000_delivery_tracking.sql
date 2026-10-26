alter table public.orders
  add column if not exists delivery_status text,
  add column if not exists buyer_latitude double precision,
  add column if not exists buyer_longitude double precision,
  add column if not exists farmer_latitude double precision,
  add column if not exists farmer_longitude double precision,
  add column if not exists delivery_updated_at timestamptz;

alter table public.orders
  drop constraint if exists orders_delivery_status_check,
  add constraint orders_delivery_status_check check (delivery_status is null or delivery_status in ('packaging', 'on_the_way', 'arrived'));

create index if not exists orders_delivery_status_idx on public.orders(delivery_status) where delivery_status is not null;

create or replace function public.create_marketplace_order(
  p_listing_id uuid,
  p_quantity numeric,
  p_fulfillment_method text default 'pickup'
)
returns uuid
language plpgsql
security invoker
set search_path = public
as $$
declare
  selected_listing public.listings%rowtype;
  buyer public.profiles%rowtype;
  farmer public.profiles%rowtype;
  calculated_delivery_area text := 'pickup';
  calculated_delivery_fee numeric := 0;
  item_total numeric;
  new_order_id uuid;
begin
  if auth.uid() is null then raise exception 'You must be signed in to place an order'; end if;
  if p_quantity <= 0 then raise exception 'Quantity must be greater than zero'; end if;
  if p_fulfillment_method not in ('pickup', 'delivery') then raise exception 'Choose pickup or delivery'; end if;
  select * into selected_listing from public.listings where id = p_listing_id and is_active = true for update;
  if not found then raise exception 'This listing is no longer available'; end if;
  if selected_listing.farmer_id = auth.uid() then raise exception 'You cannot order your own listing'; end if;
  select * into buyer from public.profiles where id = auth.uid();
  select * into farmer from public.profiles where id = selected_listing.farmer_id;
  item_total := selected_listing.price * p_quantity;
  if p_fulfillment_method = 'delivery' then
    if nullif(trim(buyer.location), '') is not null and nullif(trim(farmer.location), '') is not null and lower(trim(buyer.location)) = lower(trim(farmer.location)) then
      calculated_delivery_area := 'same_area'; calculated_delivery_fee := 50;
    else calculated_delivery_area := 'different_area'; calculated_delivery_fee := 150;
    end if;
  end if;
  insert into public.orders (
    buyer_id, listing_id, quantity, item_amount, delivery_fee, total_amount,
    fulfillment_method, delivery_area, delivery_status, buyer_latitude, buyer_longitude,
    farmer_latitude, farmer_longitude, delivery_updated_at
  ) values (
    auth.uid(), p_listing_id, p_quantity, item_total, calculated_delivery_fee, item_total + calculated_delivery_fee,
    p_fulfillment_method, calculated_delivery_area,
    case when p_fulfillment_method = 'delivery' then 'packaging' else null end,
    buyer.latitude, buyer.longitude, farmer.latitude, farmer.longitude,
    case when p_fulfillment_method = 'delivery' then now() else null end
  ) returning id into new_order_id;
  insert into public.notifications (user_id, type, title, body)
  values (selected_listing.farmer_id, 'order_received', 'New order request', 'A customer requested ' || selected_listing.title);
  return new_order_id;
end;
$$;

grant execute on function public.create_marketplace_order(uuid, numeric, text) to authenticated;
