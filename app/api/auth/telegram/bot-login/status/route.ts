import { NextRequest, NextResponse, after } from 'next/server';
import { TelegramLoginRequestRepository } from '@/backend/db/repositories/telegram-login-request.repository';
import {
  linkTelegramToUser,
  notifyTelegramLinked,
  notifyTelegramSignIn,
  signInWithTelegram,
} from '@/backend/services/telegram-auth.service';
import { getCurrentUser } from '@/backend/auth/session';
import {
  LOCAL_SESSION_COOKIE,
  SESSION_COOKIE_OPTIONS,
  createLocalSession,
  encodeSession,
} from '@/backend/auth/session/local-session';
import { ROLE_REDIRECTS } from '@/backend/constants/roles';
import { logger } from '@/backend/utils/logger';
import { TELEGRAM_LOGIN_COOKIE } from '../../request-meta';

type Status = 'pending' | 'expired' | 'denied' | 'done' | 'error';

function reply(status: Status, extra: Record<string, unknown> = {}, clearCookie = false) {
  const response = NextResponse.json({ success: true, data: { status, ...extra } });
  if (clearCookie) response.cookies.set(TELEGRAM_LOGIN_COOKIE, '', { path: '/api/auth/telegram', maxAge: 0 });
  return response;
}

/**
 * Polled by the browser that started "Continue with Telegram". Once the user has pressed
 * Confirm in the bot, this finishes the sign-in (or account link) exactly once.
 */
export async function GET(request: NextRequest) {
  const id = request.cookies.get(TELEGRAM_LOGIN_COOKIE)?.value;
  const repo = new TelegramLoginRequestRepository();
  const loginRequest = id ? repo.find(id) : null;

  if (!loginRequest || loginRequest.status === 'used' || Date.now() > loginRequest.expiresAt) {
    return reply('expired', {}, true);
  }
  if (loginRequest.status === 'pending') return reply('pending');
  if (loginRequest.status === 'denied') return reply('denied', {}, true);

  // Approved: consume it before doing anything else so it can't be used twice.
  repo.update(loginRequest.id, { status: 'used' });
  const tg = loginRequest.telegram;
  if (!tg) return reply('error', { message: 'Telegram did not confirm your identity. Please try again.' }, true);

  const meta = { ip: loginRequest.ip, userAgent: loginRequest.userAgent };

  try {
    if (loginRequest.intent === 'link') {
      const current = await getCurrentUser();
      if (!current || current.id !== loginRequest.userId) {
        return reply('error', { message: 'Your session changed. Please sign in and try again.' }, true);
      }
      const user = { id: current.id, email: current.email, fullName: current.fullName || current.email, role: current.role };
      await linkTelegramToUser(tg, user, meta);
      after(() => notifyTelegramLinked(tg, user));
      return reply('done', { redirectTo: '/users/settings?telegram=linked' }, true);
    }

    const { user, isNew } = await signInWithTelegram(tg, meta);
    const token = await encodeSession(createLocalSession(user));
    const response = reply(
      'done',
      { redirectTo: loginRequest.redirectTo || ROLE_REDIRECTS[user.role] || '/users', isNew },
      true
    );
    response.cookies.set(LOCAL_SESSION_COOKIE, token, SESSION_COOKIE_OPTIONS);
    after(() => notifyTelegramSignIn(tg, user, isNew, meta));
    return response;
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Telegram sign-in failed. Please try again.';
    logger.warn('[telegram] bot login completion failed', { error: message });
    return reply('error', { message }, true);
  }
}
