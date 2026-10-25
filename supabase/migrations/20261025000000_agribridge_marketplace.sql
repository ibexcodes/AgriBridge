create type public.user_role as enum ('farmer', 'customer', 'admin');
create type public.listing_category as enum ('Fresh produce', 'Machinery', 'Fertilizer');
create type public.listing_mode as enum ('sell', 'rent');
create type public.order_status as enum ('pending', 'approved', 'completed', 'cancelled');

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null,
  role public.user_role not null default 'customer',
  location text,
  farm_name text,
  created_at timestamptz not null default now()
);

create table public.listings (
  id uuid primary key default gen_random_uuid(),
  farmer_id uuid not null references public.profiles(id) on delete cascade,
  title text not null check (char_length(title) between 3 and 120),
  category public.listing_category not null,
  description text not null check (char_length(description) between 10 and 2000),
  price numeric(12, 2) not null check (price >= 0),
  quantity text not null,
  image_url text,
  listing_mode public.listing_mode not null default 'sell',
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

create table public.orders (
  id uuid primary key default gen_random_uuid(),
  buyer_id uuid not null references public.profiles(id) on delete cascade,
  listing_id uuid not null references public.listings(id) on delete cascade,
  quantity numeric not null check (quantity > 0),
  total_amount numeric(12, 2) not null check (total_amount >= 0),
  status public.order_status not null default 'pending',
  created_at timestamptz not null default now()
);

create table public.conversations (
  id uuid primary key default gen_random_uuid(),
  customer_id uuid not null references public.profiles(id) on delete cascade,
  farmer_id uuid not null references public.profiles(id) on delete cascade,
  listing_id uuid references public.listings(id) on delete set null,
  created_at timestamptz not null default now(),
  unique(customer_id, farmer_id, listing_id)
);

create table public.messages (
  id uuid primary key default gen_random_uuid(),
  conversation_id uuid not null references public.conversations(id) on delete cascade,
  sender_id uuid not null references public.profiles(id) on delete cascade,
  body text not null check (char_length(body) between 1 and 2000),
  created_at timestamptz not null default now()
);

create table public.notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  type text not null,
  title text not null,
  body text not null,
  read_at timestamptz,
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;
alter table public.listings enable row level security;
alter table public.orders enable row level security;
alter table public.conversations enable row level security;
alter table public.messages enable row level security;
alter table public.notifications enable row level security;

create policy "Profiles are visible to authenticated users" on public.profiles for select to authenticated using (true);
create policy "Users manage their own profile" on public.profiles for all to authenticated using (auth.uid() = id) with check (auth.uid() = id);
create policy "Active listings are public" on public.listings for select using (is_active or farmer_id = auth.uid());
create policy "Farmers manage their listings" on public.listings for all to authenticated using (farmer_id = auth.uid()) with check (farmer_id = auth.uid());
create policy "Buyers create their own orders" on public.orders for insert to authenticated with check (buyer_id = auth.uid());
create policy "Order participants can view orders" on public.orders for select to authenticated using (buyer_id = auth.uid() or exists (select 1 from public.listings l where l.id = listing_id and l.farmer_id = auth.uid()));
create policy "Farmers update incoming orders" on public.orders for update to authenticated using (exists (select 1 from public.listings l where l.id = listing_id and l.farmer_id = auth.uid()));
create policy "Conversation participants can access chats" on public.conversations for all to authenticated using (customer_id = auth.uid() or farmer_id = auth.uid()) with check (customer_id = auth.uid() or farmer_id = auth.uid());
create policy "Message participants can access messages" on public.messages for all to authenticated using (sender_id = auth.uid() or exists (select 1 from public.conversations c where c.id = conversation_id and (c.customer_id = auth.uid() or c.farmer_id = auth.uid()))) with check (sender_id = auth.uid());
create policy "Users manage their notifications" on public.notifications for select to authenticated using (user_id = auth.uid());
create policy "Users mark notifications read" on public.notifications for update to authenticated using (user_id = auth.uid()) with check (user_id = auth.uid());

create index listings_category_active_idx on public.listings(category, is_active);
create index listings_farmer_idx on public.listings(farmer_id);
create index orders_buyer_idx on public.orders(buyer_id);
create index messages_conversation_created_idx on public.messages(conversation_id, created_at);
