import { requireAuth } from '@/backend/auth/guards';
import { SubscriptionService } from '@/backend/services/subscription.service';
import { apiSuccess } from '@/backend/utils/response';
import { handleApiError } from '@/backend/errors/api-error';
import { ValidationError } from '@/backend/errors/app-error';

export const dynamic = 'force-dynamic';

/** Starts a Chapa payment for one subscription period and returns the checkout URL. */
export async function POST(request: Request) {
  try {
    const user = await requireAuth();
    const service = new SubscriptionService();

    if (service.isExempt(user)) {
      throw new ValidationError('Staff accounts do not need a subscription.');
    }

    // Determine the base URL from the incoming request headers to ensure accurate redirects on Vercel
    let origin: string | undefined;
    try {
      const url = new URL(request.url);
      const forwardedProto = request.headers.get('x-forwarded-proto') || url.protocol.replace(':', '');
      const forwardedHost = request.headers.get('x-forwarded-host') || request.headers.get('host') || url.host;
      if (forwardedHost) {
        origin = `${forwardedProto}://${forwardedHost}`;
      }
    } catch {
      // Fallback to default siteConfig
    }

    const { checkoutUrl, txRef } = await service.startCheckout(user, origin);
    return apiSuccess({ checkoutUrl, txRef });
  } catch (error) {
    return handleApiError(error);
  }
}
