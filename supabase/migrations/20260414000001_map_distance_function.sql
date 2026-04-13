-- ============================================================
-- Phase 4 — Map Distance Function
-- Adds stores_near() RPC for location-based queries
-- ============================================================

-- Distance calculation function using Haversine formula
-- Returns stores within max_km, sorted by distance
-- Accessible via Supabase RPC from client and server
create or replace function public.stores_near(
  user_lat numeric,
  user_lng numeric,
  max_km numeric default 50
)
returns table (
  id uuid,
  name text,
  latitude numeric,
  longitude numeric,
  distance_km numeric
)
language sql
stable
as $$
  select
    stores.id,
    stores.name,
    stores.latitude,
    stores.longitude,
    -- Haversine formula: calculate distance in km between two points
    6371 * acos(
      cos(radians(user_lat)) * cos(radians(stores.latitude)) *
      cos(radians(stores.longitude) - radians(user_lng)) +
      sin(radians(user_lat)) * sin(radians(stores.latitude))
    ) as distance_km
  from public.stores
  where
    stores.status = 'active'
    and stores.latitude is not null
    and stores.longitude is not null
    -- Only return stores within max_km radius
    and 6371 * acos(
      cos(radians(user_lat)) * cos(radians(stores.latitude)) *
      cos(radians(stores.longitude) - radians(user_lng)) +
      sin(radians(user_lat)) * sin(radians(stores.latitude))
    ) <= max_km
  order by distance_km asc;
$$;

comment on function public.stores_near(numeric, numeric, numeric) is
  'Find stores near a location using Haversine formula. Returns stores within max_km radius, sorted by distance.';

-- Grant access to both anonymous and authenticated users
-- (anyone can find nearby stores; no auth required for discovery)
grant execute on function public.stores_near(numeric, numeric, numeric) to anon, authenticated;
