-- ============================================================================
-- TELEGRAM ACCOUNTS
-- Links a Telegram user (verified server-side via the Telegram Login Widget
-- signature) to a Selam Kids account. One Telegram account per Selam Kids
-- account, and vice versa. Rows are written only by the server (service role).
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.telegram_accounts (
  telegram_id BIGINT PRIMARY KEY,
  user_id TEXT NOT NULL UNIQUE,
  user_email TEXT NOT NULL,
  user_full_name TEXT NOT NULL,
  user_role TEXT NOT NULL CHECK (user_role IN ('KID', 'FAMILY', 'TEACHER', 'ADMIN', 'SUPERADMIN')),
  telegram_username TEXT,
  telegram_first_name TEXT,
  telegram_last_name TEXT,
  telegram_photo_url TEXT,
  -- Telegram chat id for bot messages (equals telegram_id for private chats).
  chat_id BIGINT,
  notifications_enabled BOOLEAN NOT NULL DEFAULT true,
  linked_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  last_login_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_telegram_accounts_user_id ON public.telegram_accounts(user_id);

ALTER TABLE public.telegram_accounts ENABLE ROW LEVEL SECURITY;

-- Users can read their own link; admins can read all.
-- No INSERT/UPDATE/DELETE policies: only the service role may write.
CREATE POLICY "Users read own telegram link" ON public.telegram_accounts
  FOR SELECT USING (
    auth.uid()::text = user_id OR public.has_role('ADMIN') OR public.has_role('SUPERADMIN')
  );
