import { NextRequest, after } from 'next/server';
import { AppError, ValidationError } from '@/backend/errors/app-error';
import { AuditLogRepository } from '@/backend/db/repositories/audit-log.repository';
import { AUDIT_ACTION } from '@/backend/constants/status';
import { checkRateLimit } from '@/backend/utils/security';
import { alertLinkedTelegram } from '@/backend/services/telegram-auth.service';
import { requestMeta } from '@/app/api/auth/telegram/request-meta';
import { resetPasswordSchema } from '@/backend/validation/auth.schema';
import { apiSuccess } from '@/backend/utils/response';
import { handleApiError } from '@/backend/errors/api-error';
import { getPhoneAuthStore } from '@/backend/auth/phone-auth';
import {
  LOCAL_SESSION_COOKIE,
  createLocalSession,
  encodeSession,
} from '@/backend/auth/session/local-session';
import { ROLE_REDIRECTS } from '@/backend/constants/roles';

export async function POST(request: NextRequest) {
  try {
    const meta = requestMeta(request);
    if (!checkRateLimit(`reset-ip:${meta.ip}`, 10, 10 * 60 * 1000).allowed) {
      throw new AppError('Too many attempts. Please wait a few minutes and try again.', 429, 'RATE_LIMITED');
    }

    const body = await request.json();
    const validated = resetPasswordSchema.parse(body);

    const countryCode = validated.countryCode || '+251';
    const phoneNumber = validated.phoneNumber?.trim();
    const otpCode = validated.otpCode?.trim();

    if (phoneNumber && otpCode) {
      const phoneAuth = getPhoneAuthStore();
      const updatedUser = phoneAuth.resetPasswordByPhone(
        countryCode,
        phoneNumber,
        otpCode,
        validated.password
      );

      await new AuditLogRepository().createLog({
        user_id: updatedUser.id,
        user_email: updatedUser.email,
        user_role: updatedUser.role,
        action: AUDIT_ACTION.PASSWORD_RESET,
        resource: 'auth',
        details: { method: 'telegram_code' },
        ip_address: meta.ip,
        user_agent: meta.userAgent,
      });
      after(() => alertLinkedTelegram(updatedUser, 'Password reset with a Telegram code', meta));

      // Provision session for immediate "login again"
      const localSession = createLocalSession({
        id: updatedUser.id,
        email: updatedUser.email,
        fullName: updatedUser.fullName,
        role: updatedUser.role,
      });
      const token = await encodeSession(localSession);

      const response = apiSuccess({
        message: 'Password successfully updated! You are now logged in.',
        user: {
          id: localSession.id,
          username: updatedUser.username,
          role: localSession.role,
        },
        redirectTo: ROLE_REDIRECTS[updatedUser.role] || '/users/kids',
      });

      response.cookies.set(LOCAL_SESSION_COOKIE, token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: 60 * 60 * 24 * 7,
      });

      return response;
    }

    throw new ValidationError('Please enter your phone number and the 6-digit code from Telegram.');
  } catch (error) {
    return handleApiError(error);
  }
}
