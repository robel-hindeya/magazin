import { NextRequest, after } from 'next/server';
import { alertLinkedTelegram } from '@/backend/services/telegram-auth.service';
import { requestMeta } from '@/app/api/auth/telegram/request-meta';
import { AuditLogRepository } from '@/backend/db/repositories/audit-log.repository';
import { loginSchema } from '@/backend/validation/auth.schema';
import { apiSuccess } from '@/backend/utils/response';
import { handleApiError } from '@/backend/errors/api-error';
import { UnauthorizedError } from '@/backend/errors/auth-error';
import { ROLE_REDIRECTS } from '@/backend/constants/roles';
import { AUDIT_ACTION } from '@/backend/constants/status';
import {
  LOCAL_SESSION_COOKIE,
  createLocalSession,
  encodeSession,
} from '@/backend/auth/session/local-session';
import { getPhoneAuthStore } from '@/backend/auth/phone-auth';
import { checkRateLimit } from '@/backend/utils/security';
import { AppError } from '@/backend/errors/app-error';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validated = loginSchema.parse(body);

    const identifier = (validated.phoneNumber || validated.username || validated.email || '').trim();
    if (!identifier) {
      throw new UnauthorizedError('Please enter your phone number.');
    }

    // STRICT: Anyone cannot log in with email, only login with phone
    if (identifier.includes('@')) {
      throw new UnauthorizedError('Email login is disabled. Please sign in with your phone number.');
    }

    // Brute-force protection: per IP and per account identifier.
    const { ip } = requestMeta(request);
    const ipLimit = checkRateLimit(`login-ip:${ip}`, 30, 10 * 60 * 1000);
    const idLimit = checkRateLimit(`login-id:${identifier.replace(/\D/g, '') || identifier.toLowerCase()}`, 8, 15 * 60 * 1000);
    if (!ipLimit.allowed || !idLimit.allowed) {
      const minutes = Math.ceil(Math.max(ipLimit.resetInMs, idLimit.resetInMs) / 60000);
      throw new AppError(
        `Too many sign-in attempts. Please try again in ${minutes} minute${minutes === 1 ? '' : 's'}.`,
        429,
        'RATE_LIMITED'
      );
    }

    const phoneAuth = getPhoneAuthStore();
    const phoneUser = phoneAuth.findByIdentifier(identifier);

    // Same message for unknown number and wrong password, so the form can't be used to probe accounts.
    if (!phoneUser || !phoneAuth.verifyPassword(phoneUser, validated.password)) {
      throw new UnauthorizedError('Phone number or password is incorrect. Please try again or use Forgot Password.');
    }

    const userId = phoneUser.id;
    const email = phoneUser.email;
    const fullName = phoneUser.fullName;
    const userRole = phoneUser.role;

    const localSession = createLocalSession({
      id: userId,
      email,
      fullName,
      role: userRole,
    });
    const token = await encodeSession(localSession);

    const auditRepo = new AuditLogRepository();
    await auditRepo.createLog({
      user_id: userId,
      user_email: email,
      user_role: userRole,
      action: AUDIT_ACTION.LOGIN,
      resource: 'auth',
      details: { identifier },
    });

    const response = apiSuccess({
      user: {
        id: localSession.id,
        email: localSession.email,
        role: localSession.role,
        fullName: localSession.fullName,
      },
      redirectTo: ROLE_REDIRECTS[userRole] || '/users/kids',
    });

    response.cookies.set(LOCAL_SESSION_COOKIE, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7,
    });

    // Security alert to the linked Telegram chat (if any), sent after the response.
    const meta = { ip, userAgent: request.headers.get('user-agent') || 'unknown' };
    after(() => alertLinkedTelegram({ id: userId, fullName }, 'Phone and password', meta));

    return response;
  } catch (error) {
    return handleApiError(error);
  }
}
