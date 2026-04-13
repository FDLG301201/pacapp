-- ============================================================
-- Phase 6 — Reviews
-- reviews table, RLS, rating trigger on stores
-- ============================================================

-- Add rating columns to stores
ALTER TABLE public.stores
  ADD COLUMN IF NOT EXISTS rating_avg  numeric(3,2) NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS review_count integer      NOT NULL DEFAULT 0;

-- ─── Reviews table ────────────────────────────────────────────

CREATE TABLE public.reviews (
  id              uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  store_id        uuid        NOT NULL REFERENCES public.stores(id) ON DELETE CASCADE,
  buyer_id        uuid        NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  conversation_id uuid        REFERENCES public.conversations(id) ON DELETE SET NULL,
  rating          smallint    NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment         text        CHECK (char_length(comment) <= 1000),
  created_at      timestamptz NOT NULL DEFAULT now(),
  updated_at      timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT reviews_unique_buyer_store UNIQUE (store_id, buyer_id)
);

CREATE TRIGGER reviews_updated_at
  BEFORE UPDATE ON public.reviews
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- ─── Trigger: keep stores.rating_avg and review_count in sync ──

CREATE OR REPLACE FUNCTION public.update_store_rating()
RETURNS trigger LANGUAGE plpgsql AS $$
DECLARE
  target_store_id uuid;
BEGIN
  target_store_id := COALESCE(NEW.store_id, OLD.store_id);

  UPDATE public.stores
  SET
    rating_avg   = COALESCE((
      SELECT ROUND(AVG(rating)::numeric, 2)
      FROM public.reviews
      WHERE store_id = target_store_id
    ), 0),
    review_count = (
      SELECT COUNT(*)
      FROM public.reviews
      WHERE store_id = target_store_id
    )
  WHERE id = target_store_id;

  RETURN NULL;
END;
$$;

CREATE TRIGGER reviews_update_store_rating
  AFTER INSERT OR UPDATE OR DELETE ON public.reviews
  FOR EACH ROW EXECUTE FUNCTION public.update_store_rating();

-- ─── RLS ──────────────────────────────────────────────────────

ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

-- Anyone (including anonymous) can read reviews
CREATE POLICY "reviews_select_all" ON public.reviews
  FOR SELECT USING (true);

-- Authenticated buyer can insert only if they have chatted with that store
CREATE POLICY "reviews_insert_buyer" ON public.reviews
  FOR INSERT TO authenticated
  WITH CHECK (
    buyer_id = auth.uid()
    AND EXISTS (
      SELECT 1 FROM public.conversations c
      WHERE c.buyer_id = auth.uid()
        AND c.store_id = reviews.store_id
    )
  );

-- Buyer can update their own review
CREATE POLICY "reviews_update_own" ON public.reviews
  FOR UPDATE TO authenticated
  USING (buyer_id = auth.uid())
  WITH CHECK (buyer_id = auth.uid());

-- Buyer can delete their own review
CREATE POLICY "reviews_delete_own" ON public.reviews
  FOR DELETE TO authenticated
  USING (buyer_id = auth.uid());
