alter table public.profiles add column if not exists latitude double precision;
alter table public.profiles add column if not exists longitude double precision;
alter table public.listings add column if not exists latitude double precision;
alter table public.listings add column if not exists longitude double precision;

create table if not exists public.favorites (
  user_id uuid not null references public.profiles(id) on delete cascade,
  listing_id uuid not null references public.listings(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (user_id, listing_id)
);

alter table public.favorites enable row level security;
create policy "Users manage their favorites" on public.favorites
  for all to authenticated
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

create index if not exists listings_location_idx on public.listings(latitude, longitude);
create index if not exists favorites_user_idx on public.favorites(user_id);
