create or replace function public.delete_archived_listing(p_listing_id uuid)
returns void
language plpgsql
security invoker
set search_path = public
as $$
declare
  has_active_order boolean;
begin
  if auth.uid() is null then
    raise exception 'You must be signed in to delete a listing';
  end if;

  if not exists (
    select 1
    from public.listings
    where id = p_listing_id
      and farmer_id = auth.uid()
      and is_active = false
  ) then
    raise exception 'Only your archived listings can be deleted';
  end if;

  select exists (
    select 1
    from public.orders
    where listing_id = p_listing_id
      and status <> 'cancelled'
  ) into has_active_order;

  if has_active_order then
    raise exception 'This listing has an active order and cannot be deleted';
  end if;

  delete from public.orders
  where listing_id = p_listing_id
    and status = 'cancelled';

  delete from public.listings
  where id = p_listing_id
    and farmer_id = auth.uid()
    and is_active = false;
end;
$$;

grant execute on function public.delete_archived_listing(uuid) to authenticated;
