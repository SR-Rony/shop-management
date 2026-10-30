import type { NextRequest } from 'next/server';
import { z } from 'zod';

import { SaleStatus } from '@/generated/prisma/client';
import { apiError, apiSuccess, formatZodError, handleApiError } from '@/lib/api/response';
import { createSale, listSales } from '@/lib/services/sales';
import { createSaleSchema } from '@/lib/validation/sales';

export const dynamic = 'force-dynamic';

const salesQuerySchema = z.object({
  status: z.enum(SaleStatus).optional(),
  limit: z.coerce.number().int().min(1).max(100).optional(),
});

export async function GET(request: NextRequest) {
  try {
    const parsed = salesQuerySchema.safeParse({
      status: request.nextUrl.searchParams.get('status') || undefined,
      limit: request.nextUrl.searchParams.get('limit') || undefined,
    });

    if (!parsed.success) {
      return apiError(formatZodError(parsed.error), 400);
    }

    return apiSuccess(await listSales(parsed.data));
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    let body: unknown;

    try {
      body = await request.json();
    } catch {
      return apiError('Invalid JSON body.', 400);
    }

    const parsed = createSaleSchema.safeParse(body);

    if (!parsed.success) {
      return apiError(formatZodError(parsed.error), 400);
    }

    return apiSuccess(await createSale(parsed.data), 201);
  } catch (error) {
    return handleApiError(error);
  }
}
