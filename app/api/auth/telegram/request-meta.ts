import type { NextRequest } from 'next/server';

export function requestMeta(request: NextRequest) {
  const forwarded = request.headers.get('x-forwarded-for');
  const ip = forwarded?.split(',')[0].trim() || request.headers.get('x-real-ip')?.trim() || '127.0.0.1';
  return { ip, userAgent: request.headers.get('user-agent') || 'unknown' };
}

/** Only same-site relative paths, so a crafted value can't redirect users to another site. */
export function safeRedirectPath(value: string | undefined | null): string | null {
  if (!value) return null;
  let decoded = value;
  try {
    decoded = decodeURIComponent(value);
  } catch {
    return null;
  }
  if (!decoded.startsWith('/') || decoded.startsWith('//') || decoded.includes('\\')) return null;
  if (decoded.startsWith('/auth/') || decoded.startsWith('/api/')) return null;
  return decoded;
}

/** httpOnly cookie that ties a pending Telegram sign-in to the browser that started it. */
export const TELEGRAM_LOGIN_COOKIE = 'selam_tg_login';
