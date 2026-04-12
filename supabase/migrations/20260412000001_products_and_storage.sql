-- ============================================================
-- Phase 2 — Products, Store extensions, and Storage policies
-- Run manually in the Supabase SQL editor.
-- ============================================================

-- ─── 1. Replace Phase 1 enums with Spanish / correct values ──
-- Safe: no product rows exist yet (products table not created until below).

drop type public.product_condition;
drop type public.product_gender;
drop type public.product_category;

create type public.product_condition as enum (
  'nuevo_etiqueta',
  'como_nuevo',
  'buen_estado',
  'usado'
);

create type public.product_gender as enum (
  'mujer',
  'hombre',
  'nina',
  'nino',
  'unisex'
);

create type public.product_category as enum (
  'blusa',
  'pantalon',
  'vestido',
  'falda',
  'abrigo',
  'zapatos',
  'accesorio',
  'ropa_interior',
  'ropa_deportiva',
  'otro'
);

-- ─── 2. New enums ─────────────────────────────────────────────

create type public.product_size as enum (
  'XS', 'S', 'M', 'L', 'XL', 'XXL', 'unica',
  'num_28', 'num_30', 'num_32', 'num_34', 'num_36',
  'num_38', 'num_40', 'num_42', 'num_44',
  'talla_35', 'talla_36', 'talla_37', 'talla_38', 'talla_39',
  'talla_40', 'talla_41', 'talla_42', 'talla_43', 'talla_44', 'talla_45'
);

create type public.product_status as enum ('active', 'sold', 'hidden');

create type public.store_category as enum (
  'ropa_mujer',
  'ropa_hombre',
  'ropa_ninos',
  'calzado',
  'accesorios',
  'ropa_deportiva',
  'otro'
);

-- ─── 3. Extend stores table ───────────────────────────────────
-- banner_url (already exists) is used as the primary cover image.

alter table public.stores
  add column if not exists instagram   text,
  add column if not exists facebook    text,
  add column if not exists categories  text[] not null default '{}';

-- ─── 4. Auto-title helper function ───────────────────────────
-- Converts enum values to readable Spanish labels for auto-generated titles.

create or replace function public.generate_product_title(
  p_category public.product_category,
  p_size     public.product_size
) returns text language sql immutable as $$
  select
    case p_category
      when 'blusa'         then 'Blusa'
      when 'pantalon'      then 'Pantalón'
      when 'vestido'       then 'Vestido'
      when 'falda'         then 'Falda'
      when 'abrigo'        then 'Abrigo'
      when 'zapatos'       then 'Zapatos'
      when 'accesorio'     then 'Accesorio'
      when 'ropa_interior' then 'Ropa interior'
      when 'ropa_deportiva'then 'Ropa deportiva'
      else                      'Prenda'
    end
    || ' talla ' ||
    case p_size
      when 'XS'       then 'XS'
      when 'S'        then 'S'
      when 'M'        then 'M'
      when 'L'        then 'L'
      when 'XL'       then 'XL'
      when 'XXL'      then 'XXL'
      when 'unica'    then 'única'
      when 'num_28'   then '28'
      when 'num_30'   then '30'
      when 'num_32'   then '32'
      when 'num_34'   then '34'
      when 'num_36'   then '36'
      when 'num_38'   then '38'
      when 'num_40'   then '40'
      when 'num_42'   then '42'
      when 'num_44'   then '44'
      when 'talla_35' then '35'
      when 'talla_36' then '36'
      when 'talla_37' then '37'
      when 'talla_38' then '38'
      when 'talla_39' then '39'
      when 'talla_40' then '40'
      when 'talla_41' then '41'
      when 'talla_42' then '42'
      when 'talla_43' then '43'
      when 'talla_44' then '44'
      when 'talla_45' then '45'
      else                  p_size::text
    end;
$$;

-- ─── 5. Products table ────────────────────────────────────────

create table public.products (
  id            uuid        primary key default gen_random_uuid(),
  store_id      uuid        not null references public.stores(id) on delete cascade,
  title         text,
  price         numeric(10, 2) not null check (price > 0),
  size          public.product_size      not null,
  category      public.product_category  not null,
  condition     public.product_condition not null,
  gender        public.product_gender    not null,
  description   text,
  brand         text,
  color         text,
  material      text,
  status        public.product_status not null default 'active',
  views_count   integer not null default 0,
  is_wholesale  boolean not null default false,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

comment on table public.products is
  'One row per product listing. Belongs to a store. CRUD implemented in Phase 2.';

-- Auto-fill title when null on insert
create or replace function public.handle_product_title()
returns trigger language plpgsql as $$
begin
  if new.title is null or trim(new.title) = '' then
    new.title := public.generate_product_title(new.category, new.size);
  end if;
  return new;
end;
$$;

create trigger products_auto_title
  before insert on public.products
  for each row execute function public.handle_product_title();

create trigger products_updated_at
  before update on public.products
  for each row execute function public.handle_updated_at();

-- Indexes for catalog queries
create index products_store_id_idx  on public.products(store_id);
create index products_status_idx    on public.products(status);
create index products_category_idx  on public.products(category);
create index products_store_status_idx on public.products(store_id, status);

-- ─── 6. RLS: products ─────────────────────────────────────────

alter table public.products enable row level security;

-- Anyone can read active products (public catalog — Phase 3 will use this)
create policy "products_select_active"
  on public.products for select
  using (status = 'active');

-- Sellers can read ALL their own products (including hidden/sold)
create policy "products_select_own"
  on public.products for select
  using (
    exists (
      select 1 from public.stores
      where stores.id = products.store_id
        and stores.owner_id = auth.uid()
    )
  );

-- Admins can read everything
create policy "products_select_admin"
  on public.products for select
  using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role = 'admin'
    )
  );

-- Only the store owner can insert products into their store
create policy "products_insert_own"
  on public.products for insert
  with check (
    exists (
      select 1 from public.stores
      where stores.id = store_id
        and stores.owner_id = auth.uid()
    )
  );

-- Store owner or admin can update
create policy "products_update_own"
  on public.products for update
  using (
    exists (
      select 1 from public.stores
      where stores.id = products.store_id
        and stores.owner_id = auth.uid()
    )
  )
  with check (
    exists (
      select 1 from public.stores
      where stores.id = store_id
        and stores.owner_id = auth.uid()
    )
  );

create policy "products_update_admin"
  on public.products for update
  using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role = 'admin'
    )
  );

-- Store owner or admin can delete
create policy "products_delete_own"
  on public.products for delete
  using (
    exists (
      select 1 from public.stores
      where stores.id = products.store_id
        and stores.owner_id = auth.uid()
    )
  );

create policy "products_delete_admin"
  on public.products for delete
  using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role = 'admin'
    )
  );

-- ─── 7. Product images table ──────────────────────────────────

create table public.product_images (
  id            uuid        primary key default gen_random_uuid(),
  product_id    uuid        not null references public.products(id) on delete cascade,
  url           text        not null,
  storage_path  text        not null,
  position      smallint    not null default 0,
  created_at    timestamptz not null default now(),
  constraint product_images_position_unique unique (product_id, position)
);

comment on table public.product_images is
  'Images for a product. storage_path is used to delete the file from Supabase Storage.';

create index product_images_product_id_idx on public.product_images(product_id);

-- ─── 8. RLS: product_images ───────────────────────────────────

alter table public.product_images enable row level security;

-- Anyone can read images (mirrors product active select)
create policy "product_images_select_public"
  on public.product_images for select
  using (true);

-- Only the owner of the store that owns the product can insert images
create policy "product_images_insert_own"
  on public.product_images for insert
  with check (
    exists (
      select 1
      from public.products p
      join public.stores s on s.id = p.store_id
      where p.id = product_id
        and s.owner_id = auth.uid()
    )
  );

-- Only the store owner or admin can delete images
create policy "product_images_delete_own"
  on public.product_images for delete
  using (
    exists (
      select 1
      from public.products p
      join public.stores s on s.id = p.store_id
      where p.id = product_images.product_id
        and s.owner_id = auth.uid()
    )
  );

create policy "product_images_delete_admin"
  on public.product_images for delete
  using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role = 'admin'
    )
  );

-- ─── 9. Storage bucket policies ───────────────────────────────
-- NOTE: Buckets must be created manually in the Supabase dashboard first:
--   - "store-assets"   (public)
--   - "product-images" (public)
-- Then these policies govern who can write/delete objects.

-- store-assets: seller can only touch their own folder ({seller_id}/*)
create policy "store_assets_select_public"
  on storage.objects for select
  using (bucket_id = 'store-assets');

create policy "store_assets_insert_own"
  on storage.objects for insert
  with check (
    bucket_id = 'store-assets'
    and auth.role() = 'authenticated'
    and (storage.foldername(name))[1] = auth.uid()::text
    and exists (
      select 1 from public.profiles
      where id = auth.uid() and role in ('seller', 'admin')
    )
  );

create policy "store_assets_update_own"
  on storage.objects for update
  using (
    bucket_id = 'store-assets'
    and auth.role() = 'authenticated'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

create policy "store_assets_delete_own"
  on storage.objects for delete
  using (
    bucket_id = 'store-assets'
    and auth.role() = 'authenticated'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

-- product-images: seller can only touch their own folder ({seller_id}/*)
create policy "product_images_storage_select_public"
  on storage.objects for select
  using (bucket_id = 'product-images');

create policy "product_images_storage_insert_own"
  on storage.objects for insert
  with check (
    bucket_id = 'product-images'
    and auth.role() = 'authenticated'
    and (storage.foldername(name))[1] = auth.uid()::text
    and exists (
      select 1 from public.profiles
      where id = auth.uid() and role in ('seller', 'admin')
    )
  );

create policy "product_images_storage_update_own"
  on storage.objects for update
  using (
    bucket_id = 'product-images'
    and auth.role() = 'authenticated'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

create policy "product_images_storage_delete_own"
  on storage.objects for delete
  using (
    bucket_id = 'product-images'
    and auth.role() = 'authenticated'
    and (storage.foldername(name))[1] = auth.uid()::text
  );
