create or replace function public.create_marketplace_order(
  p_listing_id uuid,
  p_quantity numeric
)
returns uuid
language plpgsql
security invoker
set search_path = public
as $$
declare
  selected_listing public.listings%rowtype;
  new_order_id uuid;
begin
  if auth.uid() is null then
    raise exception 'You must be signed in to place an order';
  end if;
  if p_quantity <= 0 then
    raise exception 'Quantity must be greater than zero';
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

  insert into public.orders (buyer_id, listing_id, quantity, total_amount)
  values (auth.uid(), p_listing_id, p_quantity, selected_listing.price * p_quantity)
  returning id into new_order_id;

  insert into public.notifications (user_id, type, title, body)
  values (
    selected_listing.farmer_id,
    'order_received',
    'New order request',
    'A customer requested ' || selected_listing.title
  );

  return new_order_id;
end;
$$;

grant execute on function public.create_marketplace_order(uuid, numeric) to authenticated;
