import { apiSuccess, handleApiError } from '@/lib/api/response';
import { getProductById } from '@/lib/services/products';

export const dynamic = 'force-dynamic';

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    return apiSuccess(await getProductById(id));
  } catch (error) {
    return handleApiError(error);
  }
}
