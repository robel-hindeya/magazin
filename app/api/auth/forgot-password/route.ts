import { NextRequest } from 'next/server';
import { forgotPasswordSchema } from '@/backend/validation/auth.schema';
import { apiSuccess } from '@/backend/utils/response';
import { handleApiError } from '@/backend/errors/api-error';
import { AppError, ValidationError } from '@/backend/errors/app-error';
import { OTP_TTL_MS, getPhoneAuthStore } from '@/backend/auth/phone-auth';
import { escapeTelegramHtml, getTelegramBotUsername, sendTelegramMessage } from '@/backend/auth/telegram';
import { getTelegramAccountRepository } from '@/backend/services/telegram-auth.service';
import { checkRateLimit } from '@/backend/utils/security';
import { requestMeta } from '@/app/api/auth/telegram/request-meta';

/**
 * Step 1 of password reset: sends a one-time 6-digit code to the Telegram account linked
 * to this phone number. The code is never returned to the browser in production.
 * The response is the same whether or not the number exists, so it can't be used to find accounts.
 */
export async function POST(request: NextRequest) {
  try {
    const { ip } = requestMeta(request);
    const limit = checkRateLimit(`forgot-ip:${ip}`, 5, 10 * 60 * 1000);
    if (!limit.allowed) {
      throw new AppError('Too many reset requests. Please wait a few minutes and try again.', 429, 'RATE_LIMITED');
    }

    const body = await request.json();
    const validated = forgotPasswordSchema.parse(body);
    const countryCode = validated.countryCode || '+251';
    const phoneNumber = validated.phoneNumber?.trim();
    if (!phoneNumber || phoneNumber.replace(/\D/g, '').length < 7) {
      throw new ValidationError('Please enter the phone number of your account.');
    }

    const store = getPhoneAuthStore();
    const user = store.findByPhone(countryCode, phoneNumber);
    const link = user ? await getTelegramAccountRepository().findByUserId(user.id) : null;

    let devCode: string | undefined;
    if (user) {
      const result = store.createOtp(user);
      if ('retryInMs' in result) {
        const seconds = Math.ceil(result.retryInMs / 1000);
        throw new AppError(`Please wait ${seconds} seconds before requesting another code.`, 429, 'RATE_LIMITED');
      }

      if (link?.chat_id) {
        await sendTelegramMessage(
          link.chat_id,
          [
            '🔑 <b>Selam Kids password reset</b>',
            '',
            `Your code: <code>${result.code}</code>`,
            '',
            `It works once and expires in ${OTP_TTL_MS / 60000} minutes.`,
            `Account: ${escapeTelegramHtml(user.fullName)}`,
            '',
            "If you didn't ask for this, ignore this message. Your password stays the same.",
          ].join('\n')
        );
      }

      // Development only: show the code on screen so the flow can be tested without Telegram.
      if (process.env.NODE_ENV !== 'production') {
        devCode = result.code;
      }
    }

    const bot = getTelegramBotUsername();
    return apiSuccess({
      message: bot
        ? `If this number has an account with Telegram connected, we sent a 6-digit code to your Telegram from @${bot}.`
        : 'If this number has an account with Telegram connected, we sent a 6-digit code to your Telegram.',
      noTelegramHelp:
        'No code? Telegram must be connected to your account (Settings → Telegram). Otherwise, contact Selam Kids support.',
      ...(devCode ? { devCode } : {}),
    });
  } catch (error) {
    return handleApiError(error);
  }
}
