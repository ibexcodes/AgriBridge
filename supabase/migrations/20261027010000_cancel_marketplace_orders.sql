create or replace function public.cancel_marketplace_order(p_order_id uuid)
returns void
language plpgsql
security invoker
set search_path = public
as $$
declare
  selected_order public.orders%rowtype;
  recipient_id uuid;
begin
  if auth.uid() is null then
    raise exception 'You must be signed in to cancel an order';
  end if;

  select o.* into selected_order
  from public.orders o
  join public.listings l on l.id = o.listing_id
  where o.id = p_order_id
    and (o.buyer_id = auth.uid() or l.farmer_id = auth.uid())
  for update;

  if not found then
    raise exception 'Order not found or you do not have permission to cancel it';
  end if;
  if selected_order.status not in ('pending', 'approved') then
    raise exception 'Only pending or approved orders can be cancelled';
  end if;

  update public.orders
  set status = 'cancelled'
  where id = p_order_id;

  select case when selected_order.buyer_id = auth.uid() then l.farmer_id else selected_order.buyer_id end
  into recipient_id
  from public.listings l
  where l.id = selected_order.listing_id;

  insert into public.notifications (user_id, type, title, body)
  values (recipient_id, 'order_cancelled', 'Order cancelled', 'An order request has been cancelled.');
end;
$$;

grant execute on function public.cancel_marketplace_order(uuid) to authenticated;
