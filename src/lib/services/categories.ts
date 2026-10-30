import 'server-only';

import { prisma } from '@/lib/db/prisma';

export async function listCategories() {
  return prisma.category.findMany({
    include: { _count: { select: { products: true } } },
    orderBy: { name: 'asc' },
  });
}
