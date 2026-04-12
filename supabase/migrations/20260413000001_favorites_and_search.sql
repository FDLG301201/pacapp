-- Phase 3: Favorites, Full-Text Search, and View Counter

-- 1. favorites table
create table public.favorites (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  product_id uuid references public.products(id) on delete cascade,
  store_id uuid references public.stores(id) on delete cascade,
  created_at timestamptz default now(),
  constraint fav_one_target check (
    (product_id is not null)::int + (store_id is not null)::int = 1
  )
);

create unique index favorites_user_product_idx on favorites(user_id, product_id) where product_id is not null;
create unique index favorites_user_store_idx on favorites(user_id, store_id) where store_id is not null;

alter table public.favorites enable row level security;

create policy "users read own favorites" on favorites for select using (auth.uid() = user_id);
create policy "users insert own favorites" on favorites for insert with check (auth.uid() = user_id);
create policy "users delete own favorites" on favorites for delete using (auth.uid() = user_id);
create policy "admins read all favorites" on favorites for select
  using (exists (select 1 from public.profiles where id = auth.uid() and role = 'admin'));

-- 2. Full-text search vector on products
alter table public.products add column search_vector tsvector
  generated always as (
    setweight(to_tsvector('spanish', coalesce(title, '')), 'A') ||
    setweight(to_tsvector('spanish', coalesce(brand, '')), 'B') ||
    setweight(to_tsvector('spanish', coalesce(description, '')), 'C')
  ) stored;

create index products_search_idx on products using gin(search_vector);

-- 3. Store name search index
create index stores_name_idx on stores using gin(to_tsvector('spanish', name));

-- 4. Atomic view counter RPC
create or replace function increment_product_views(p_product_id uuid)
returns void language plpgsql security definer as $$
begin
  update public.products
  set views_count = views_count + 1
  where id = p_product_id and status = 'active';
end;
$$;

grant execute on function increment_product_views(uuid) to anon, authenticated;
