import { requireAuth } from '@/backend/auth/guards';
import { SubscriptionService } from '@/backend/services/subscription.service';
import { apiSuccess } from '@/backend/utils/response';
import { handleApiError } from '@/backend/errors/api-error';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const user = await requireAuth();
    const status = await new SubscriptionService().getStatus(user);
    return apiSuccess(status);
  } catch (error) {
    return handleApiError(error);
  }
}
