-- ============================================================================
-- SUBSCRIPTIONS & PAYMENTS (Chapa)
-- Every user gets a free trial (default 14 days). After that, access to the
-- /users portal requires a paid period (default 30 days per payment).
-- Rows are written only by the server using the service role key.
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.subscriptions (
  user_id TEXT PRIMARY KEY,
  plan TEXT NOT NULL DEFAULT 'MONTHLY',
  trial_started_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  trial_ends_at TIMESTAMPTZ NOT NULL,
  current_period_start TIMESTAMPTZ,
  current_period_end TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL,
  tx_ref TEXT NOT NULL UNIQUE,
  provider TEXT NOT NULL DEFAULT 'CHAPA',
  provider_ref TEXT,
  amount NUMERIC(12, 2) NOT NULL,
  currency TEXT NOT NULL DEFAULT 'ETB',
  period_days INTEGER NOT NULL DEFAULT 30,
  status TEXT NOT NULL DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'SUCCESS', 'FAILED')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  verified_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_payments_user_id ON public.payments(user_id);
CREATE INDEX IF NOT EXISTS idx_payments_status ON public.payments(status);

ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;

-- Users can read their own billing rows; admins can read all.
-- No INSERT/UPDATE/DELETE policies: only the service role may write.
CREATE POLICY "Users read own subscription" ON public.subscriptions
  FOR SELECT USING (
    auth.uid()::text = user_id OR public.has_role('ADMIN') OR public.has_role('SUPERADMIN')
  );

CREATE POLICY "Users read own payments" ON public.payments
  FOR SELECT USING (
    auth.uid()::text = user_id OR public.has_role('ADMIN') OR public.has_role('SUPERADMIN')
  );
