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
  buyer_location text;
  farmer_location text;
  calculated_delivery_area text := 'pickup';
  calculated_delivery_fee numeric := 0;
  item_total numeric;
  new_order_id uuid;
begin
  if auth.uid() is null then
    raise exception 'You must be signed in to place an order';
  end if;
  if p_quantity <= 0 then
    raise exception 'Quantity must be greater than zero';
  end if;
  if p_fulfillment_method not in ('pickup', 'delivery') then
    raise exception 'Choose pickup or delivery';
  end if;

  select * into selected_listing
  from public.listings
  where id = p_listing_id and is_active = true
  for update;

  if not found then
    raise exception 'This listing is no longer available';
  end if;
  if selected_listing.farmer_id = auth.uid() then
    raise exception 'You cannot order your own listing';
  end if;

  select location into buyer_location from public.profiles where id = auth.uid();
  select location into farmer_location from public.profiles where id = selected_listing.farmer_id;
  item_total := selected_listing.price * p_quantity;

  if p_fulfillment_method = 'delivery' then
    if nullif(trim(buyer_location), '') is not null
      and nullif(trim(farmer_location), '') is not null
      and lower(trim(buyer_location)) = lower(trim(farmer_location)) then
      calculated_delivery_area := 'same_area';
      calculated_delivery_fee := 50;
    else
      calculated_delivery_area := 'different_area';
      calculated_delivery_fee := 150;
    end if;
  end if;

  insert into public.orders (
    buyer_id, listing_id, quantity, item_amount, delivery_fee,
    total_amount, fulfillment_method, delivery_area
  )
  values (
    auth.uid(), p_listing_id, p_quantity, item_total, calculated_delivery_fee,
    item_total + calculated_delivery_fee, p_fulfillment_method, calculated_delivery_area
  )
  returning id into new_order_id;

  insert into public.notifications (user_id, type, title, body)
  values (
    selected_listing.farmer_id,
    'order_received',
    'New order request',
    'A customer requested ' || selected_listing.title ||
      case when p_fulfillment_method = 'delivery'
        then ' with ' || calculated_delivery_area || ' delivery'
        else ' for pickup'
      end
  );

  return new_order_id;
end;
$$;

grant execute on function public.create_marketplace_order(uuid, numeric, text) to authenticated;
