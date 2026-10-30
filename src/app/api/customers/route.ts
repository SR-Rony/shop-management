import { apiSuccess, handleApiError } from '@/lib/api/response';
import { listCustomers } from '@/lib/services/customers';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    return apiSuccess(await listCustomers());
  } catch (error) {
    return handleApiError(error);
  }
}
