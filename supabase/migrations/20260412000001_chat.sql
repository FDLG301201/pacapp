-- ============================================================
-- Phase 5 — Chat
-- Realtime messaging between buyers and sellers
-- Run this in the Supabase SQL Editor
-- ============================================================

-- ─── Add email to profiles ────────────────────────────────────
-- Needed so notify route can email recipients without service role key

ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS email text;

-- Backfill existing users
UPDATE public.profiles p
SET    email = u.email
FROM   auth.users u
WHERE  p.id = u.id
  AND  p.email IS NULL;

-- Update trigger to persist email on sign-up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, avatar_url)
  VALUES (
    new.id,
    new.email,
    new.raw_user_meta_data->>'full_name',
    new.raw_user_meta_data->>'avatar_url'
  );
  RETURN new;
END;
$$;

-- ─── Conversations ────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS public.conversations (
  id              uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  buyer_id        uuid        NOT NULL REFERENCES public.profiles(id)  ON DELETE CASCADE,
  store_id        uuid        NOT NULL REFERENCES public.stores(id)    ON DELETE CASCADE,
  product_id      uuid        NULL, -- nullable; Phase 3 will add FK to products
  last_message    text,
  last_message_at timestamptz,
  buyer_unread    integer     NOT NULL DEFAULT 0,
  seller_unread   integer     NOT NULL DEFAULT 0,
  created_at      timestamptz NOT NULL DEFAULT now(),
  updated_at      timestamptz NOT NULL DEFAULT now(),
  UNIQUE (buyer_id, store_id)
);

COMMENT ON TABLE public.conversations IS
  'One conversation per buyer-store pair. Initiated by buyer.';

CREATE TRIGGER conversations_updated_at
  BEFORE UPDATE ON public.conversations
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE INDEX IF NOT EXISTS conversations_buyer_id_idx ON public.conversations(buyer_id);
CREATE INDEX IF NOT EXISTS conversations_store_id_idx ON public.conversations(store_id);
CREATE INDEX IF NOT EXISTS conversations_last_msg_idx  ON public.conversations(last_message_at DESC NULLS LAST);

-- ─── RLS: conversations ───────────────────────────────────────

ALTER TABLE public.conversations ENABLE ROW LEVEL SECURITY;

-- Buyers see their own conversations
CREATE POLICY "conversations_select_buyer"
  ON public.conversations FOR SELECT TO authenticated
  USING (buyer_id = auth.uid());

-- Sellers see conversations for their store
CREATE POLICY "conversations_select_seller"
  ON public.conversations FOR SELECT TO authenticated
  USING (
    store_id IN (SELECT id FROM public.stores WHERE owner_id = auth.uid())
  );

-- Only buyers can create conversations (for themselves)
CREATE POLICY "conversations_insert_buyer"
  ON public.conversations FOR INSERT TO authenticated
  WITH CHECK (
    buyer_id = auth.uid()
    AND EXISTS (
      SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'buyer'
    )
  );

-- Buyer marks their conversation as read
CREATE POLICY "conversations_update_buyer"
  ON public.conversations FOR UPDATE TO authenticated
  USING (buyer_id = auth.uid())
  WITH CHECK (buyer_id = auth.uid());

-- Seller marks their store's conversations as read
CREATE POLICY "conversations_update_seller"
  ON public.conversations FOR UPDATE TO authenticated
  USING (
    store_id IN (SELECT id FROM public.stores WHERE owner_id = auth.uid())
  );

-- ─── Messages ─────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS public.messages (
  id              uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id uuid        NOT NULL REFERENCES public.conversations(id) ON DELETE CASCADE,
  sender_id       uuid        NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  content         text        NOT NULL CHECK (char_length(content) BETWEEN 1 AND 2000),
  created_at      timestamptz NOT NULL DEFAULT now()
);

COMMENT ON TABLE public.messages IS
  'Individual messages within a conversation. Immutable after insert.';

CREATE INDEX IF NOT EXISTS messages_conversation_id_idx ON public.messages(conversation_id);
CREATE INDEX IF NOT EXISTS messages_created_at_idx      ON public.messages(created_at);

-- ─── RLS: messages ────────────────────────────────────────────

ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

-- Participants in a conversation can view messages
CREATE POLICY "messages_select_participant"
  ON public.messages FOR SELECT TO authenticated
  USING (
    conversation_id IN (
      SELECT id FROM public.conversations
      WHERE  buyer_id = auth.uid()
          OR store_id IN (SELECT id FROM public.stores WHERE owner_id = auth.uid())
    )
  );

-- Participants can send messages
CREATE POLICY "messages_insert_participant"
  ON public.messages FOR INSERT TO authenticated
  WITH CHECK (
    sender_id = auth.uid()
    AND conversation_id IN (
      SELECT id FROM public.conversations
      WHERE  buyer_id = auth.uid()
          OR store_id IN (SELECT id FROM public.stores WHERE owner_id = auth.uid())
    )
  );

-- ─── Trigger: sync conversation on new message ────────────────

CREATE OR REPLACE FUNCTION public.handle_new_message()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER AS $$
DECLARE
  v_buyer_id uuid;
BEGIN
  SELECT buyer_id INTO v_buyer_id
  FROM   public.conversations
  WHERE  id = NEW.conversation_id;

  UPDATE public.conversations SET
    last_message    = NEW.content,
    last_message_at = NEW.created_at,
    buyer_unread    = CASE
                        WHEN NEW.sender_id <> v_buyer_id THEN buyer_unread + 1
                        ELSE buyer_unread
                      END,
    seller_unread   = CASE
                        WHEN NEW.sender_id = v_buyer_id THEN seller_unread + 1
                        ELSE seller_unread
                      END,
    updated_at      = NOW()
  WHERE id = NEW.conversation_id;

  RETURN NEW;
END;
$$;

CREATE TRIGGER on_message_created
  AFTER INSERT ON public.messages
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_message();
