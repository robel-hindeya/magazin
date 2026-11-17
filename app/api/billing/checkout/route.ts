import { requireAuth } from '@/backend/auth/guards';
import { SubscriptionService } from '@/backend/services/subscription.service';
import { apiSuccess } from '@/backend/utils/response';
import { handleApiError } from '@/backend/errors/api-error';
import { ValidationError } from '@/backend/errors/app-error';

/** Starts a Chapa payment for one subscription period and returns the checkout URL. */
export async function POST() {
  try {
    const user = await requireAuth();
    const service = new SubscriptionService();

    if (service.isExempt(user)) {
      throw new ValidationError('Staff accounts do not need a subscription.');
    }

    const { checkoutUrl, txRef } = await service.startCheckout(user);
    return apiSuccess({ checkoutUrl, txRef });
  } catch (error) {
    return handleApiError(error);
  }
}
