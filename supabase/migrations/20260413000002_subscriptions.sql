-- ============================================================
-- Phase 7 — Subscriptions
-- subscription_requests table, storage bucket for payment proofs
-- ============================================================

-- ─── Storage bucket for payment proofs ───────────────────────

INSERT INTO storage.buckets (id, name, public)
VALUES ('payment-proofs', 'payment-proofs', true)
ON CONFLICT (id) DO NOTHING;

-- Authenticated sellers can upload proofs
CREATE POLICY "proof_upload_authenticated"
  ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'payment-proofs');

-- Anyone can view (public bucket — URLs are unguessable UUIDs)
CREATE POLICY "proof_select_all"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'payment-proofs');

-- Uploader can delete their own files
CREATE POLICY "proof_delete_own"
  ON storage.objects FOR DELETE TO authenticated
  USING (bucket_id = 'payment-proofs' AND owner = auth.uid());

-- ─── Admin UPDATE policy for stores ──────────────────────────
-- Allows admins to activate subscriptions on any store

CREATE POLICY "stores_update_admin"
  ON public.stores FOR UPDATE TO authenticated
  USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'))
  WITH CHECK (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));

-- ─── subscription_requests table ──────────────────────────────

CREATE TABLE public.subscription_requests (
  id           uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  store_id     uuid        NOT NULL REFERENCES public.stores(id) ON DELETE CASCADE,
  plan         public.subscription_plan NOT NULL,
  proof_url    text        NOT NULL,
  status       text        NOT NULL DEFAULT 'pending'
               CHECK (status IN ('pending', 'approved', 'rejected')),
  notes        text,
  reviewed_by  uuid        REFERENCES public.profiles(id) ON DELETE SET NULL,
  reviewed_at  timestamptz,
  created_at   timestamptz NOT NULL DEFAULT now(),
  updated_at   timestamptz NOT NULL DEFAULT now()
);

CREATE TRIGGER subscription_requests_updated_at
  BEFORE UPDATE ON public.subscription_requests
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE INDEX subscription_requests_store_id_idx ON public.subscription_requests(store_id);
CREATE INDEX subscription_requests_status_idx   ON public.subscription_requests(status);

ALTER TABLE public.subscription_requests ENABLE ROW LEVEL SECURITY;

-- Sellers see requests for their own stores
CREATE POLICY "subreq_select_seller" ON public.subscription_requests
  FOR SELECT TO authenticated
  USING (store_id IN (SELECT id FROM public.stores WHERE owner_id = auth.uid()));

-- Sellers can submit a request (not for the free plan)
CREATE POLICY "subreq_insert_seller" ON public.subscription_requests
  FOR INSERT TO authenticated
  WITH CHECK (
    plan != 'free'
    AND store_id IN (SELECT id FROM public.stores WHERE owner_id = auth.uid())
  );

-- Admins can read all
CREATE POLICY "subreq_select_admin" ON public.subscription_requests
  FOR SELECT TO authenticated
  USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));

-- Admins can approve / reject
CREATE POLICY "subreq_update_admin" ON public.subscription_requests
  FOR UPDATE TO authenticated
  USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'))
  WITH CHECK (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));
