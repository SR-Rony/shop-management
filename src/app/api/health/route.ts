import { apiSuccess, handleApiError } from '@/lib/api/response';
import { checkDatabaseHealth } from '@/lib/services/health';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    return apiSuccess(await checkDatabaseHealth());
  } catch (error) {
    return handleApiError(error);
  }
}
