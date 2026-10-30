import type { NextRequest } from 'next/server';

import { apiSuccess, handleApiError } from '@/lib/api/response';
import { listProducts } from '@/lib/services/products';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const categoryId = request.nextUrl.searchParams.get('categoryId')?.trim() || undefined;
    return apiSuccess(await listProducts(categoryId));
  } catch (error) {
    return handleApiError(error);
  }
}
