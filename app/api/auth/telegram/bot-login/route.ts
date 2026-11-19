import { NextRequest, NextResponse } from 'next/server';
import { getTelegramBotUsername, isTelegramConfigured } from '@/backend/auth/telegram';
import {
  LOGIN_REQUEST_TTL_MS,
  TelegramLoginRequestRepository,
} from '@/backend/db/repositories/telegram-login-request.repository';
import { getCurrentUser } from '@/backend/auth/session';
import { ROLES } from '@/backend/constants/roles';
import { checkRateLimit } from '@/backend/utils/security';
import { TELEGRAM_LOGIN_COOKIE, requestMeta, safeRedirectPath } from '../request-meta';

const fail = (message: string, status = 400) =>
  NextResponse.json({ success: false, error: { message } }, { status });

/**
 * Starts "Continue with Telegram". Returns a t.me deep link to the bot; the browser then polls
 * /api/auth/telegram/bot-login/status until the user presses Confirm in Telegram.
 * Body: { intent: "login" | "link", redirectTo?: string }
 */
export async function POST(request: NextRequest) {
  const meta = requestMeta(request);
  if (!checkRateLimit(`tg-bot-login:${meta.ip}`, 10, 60 * 1000).allowed) {
    return fail('Too many attempts. Please wait a minute and try again.', 429);
  }
  if (!isTelegramConfigured()) {
    return fail('Telegram sign-in is not set up on this server yet.', 503);
  }

  let body: { intent?: string; redirectTo?: string } = {};
  try {
    body = await request.json();
  } catch {
    // Empty body -> defaults.
  }
  const intent = body.intent === 'link' ? 'link' : 'login';

  let userId: string | null = null;
  if (intent === 'link') {
    const user = await getCurrentUser();
    if (!user) return fail('Please sign in first.', 401);
    if (user.role === ROLES.KID) {
      return fail('Kid accounts cannot connect Telegram. Ask a parent to connect it from their account.', 403);
    }
    userId = user.id;
  }

  const loginRequest = new TelegramLoginRequestRepository().create({
    intent,
    userId,
    redirectTo: intent === 'login' ? safeRedirectPath(body.redirectTo) : null,
    ip: meta.ip,
    userAgent: meta.userAgent,
  });

  const response = NextResponse.json({
    success: true,
    data: {
      botUrl: `https://t.me/${getTelegramBotUsername()}?start=login_${loginRequest.id}`,
      botUsername: getTelegramBotUsername(),
      expiresAt: loginRequest.expiresAt,
    },
  });
  // Ties the request to this browser: only it can collect the session after confirmation.
  response.cookies.set(TELEGRAM_LOGIN_COOKIE, loginRequest.id, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/api/auth/telegram',
    maxAge: Math.ceil(LOGIN_REQUEST_TTL_MS / 1000),
  });
  return response;
}
