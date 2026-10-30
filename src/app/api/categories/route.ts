import { apiSuccess, handleApiError } from '@/lib/api/response';
import { listCategories } from '@/lib/services/categories';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    return apiSuccess(await listCategories());
  } catch (error) {
    return handleApiError(error);
  }
}
