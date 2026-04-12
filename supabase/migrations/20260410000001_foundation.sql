-- ============================================================
-- Phase 1 — Foundation
-- Creates enums, profiles table, stores skeleton, and RLS policies
-- ============================================================

-- ─── Enums ───────────────────────────────────────────────────

create type public.user_role as enum ('buyer', 'seller', 'admin');

create type public.subscription_plan as enum ('free', 'basic', 'pro');

create type public.subscription_status as enum ('active', 'expired', 'pending');

create type public.store_status as enum ('active', 'inactive', 'suspended');

create type public.product_condition as enum ('new', 'like_new', 'good', 'fair');

create type public.product_gender as enum ('men', 'women', 'unisex', 'kids');

create type public.product_category as enum (
  'tops', 'bottoms', 'dresses', 'outerwear', 'shoes',
  'accessories', 'bags', 'sportswear', 'formal', 'other'
);

-- ─── Profiles ────────────────────────────────────────────────
-- One row per auth.users entry. Created via trigger on sign-up.

create table public.profiles (
  id            uuid primary key references auth.users(id) on delete cascade,
  role          public.user_role not null default 'buyer',
  full_name     text,
  avatar_url    text,
  phone         text,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

comment on table public.profiles is
  'Public profile for every authenticated user. Mirrors auth.users.';

-- Auto-update updated_at on every row change
create or replace function public.handle_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger profiles_updated_at
  before update on public.profiles
  for each row execute function public.handle_updated_at();

-- Auto-create a profile row when a new user signs up
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, full_name, avatar_url, role)
  values (
    new.id,
    new.raw_user_meta_data->>'full_name',
    new.raw_user_meta_data->>'avatar_url',
    coalesce(
      (new.raw_user_meta_data->>'role')::public.user_role,
      'buyer'
    )
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ─── RLS: profiles ───────────────────────────────────────────

alter table public.profiles enable row level security;

-- Visitors can see all profiles (for store pages etc.)
create policy "profiles_select_public"
  on public.profiles for select
  using (true);

-- Users can only update their own profile
create policy "profiles_update_own"
  on public.profiles for update
  using (auth.uid() = id)
  with check (auth.uid() = id);

-- Insert is handled by the trigger (service role), not by users directly
create policy "profiles_insert_trigger"
  on public.profiles for insert
  with check (auth.uid() = id);

-- ─── Stores (skeleton) ───────────────────────────────────────
-- Full CRUD comes in Phase 2. This table is here so foreign keys work.

create table public.stores (
  id                  uuid primary key default gen_random_uuid(),
  owner_id            uuid not null references public.profiles(id) on delete cascade,
  name                text not null,
  slug                text not null unique,
  description         text,
  logo_url            text,
  banner_url          text,
  phone               text,
  whatsapp            text,
  address             text,
  province            text,
  latitude            numeric(10, 7),
  longitude           numeric(10, 7),
  status              public.store_status not null default 'active',
  subscription_plan   public.subscription_plan not null default 'free',
  subscription_status public.subscription_status not null default 'active',
  subscription_ends_at timestamptz,
  is_verified         boolean not null default false,
  created_at          timestamptz not null default now(),
  updated_at          timestamptz not null default now()
);

comment on table public.stores is
  'One store per seller. Full CRUD implemented in Phase 2.';

create trigger stores_updated_at
  before update on public.stores
  for each row execute function public.handle_updated_at();

create index stores_owner_id_idx on public.stores(owner_id);
create index stores_province_idx  on public.stores(province);
create index stores_status_idx    on public.stores(status);

-- ─── RLS: stores ─────────────────────────────────────────────

alter table public.stores enable row level security;

-- Anyone can read active stores
create policy "stores_select_active"
  on public.stores for select
  using (status = 'active');

-- Admins can read all stores regardless of status
create policy "stores_select_admin"
  on public.stores for select
  using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role = 'admin'
    )
  );

-- Sellers can insert their own store
create policy "stores_insert_own"
  on public.stores for insert
  with check (
    auth.uid() = owner_id
    and exists (
      select 1 from public.profiles
      where id = auth.uid() and role = 'seller'
    )
  );

-- Sellers can update their own store
create policy "stores_update_own"
  on public.stores for update
  using (auth.uid() = owner_id)
  with check (auth.uid() = owner_id);

-- Admins can update any store (for suspension/verification)
create policy "stores_update_admin"
  on public.stores for update
  using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role = 'admin'
    )
  );

-- Sellers can delete their own store
create policy "stores_delete_own"
  on public.stores for delete
  using (auth.uid() = owner_id);
