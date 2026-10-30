import 'server-only';

import { prisma } from '@/lib/db/prisma';

export async function listCustomers() {
  return prisma.customer.findMany({
    include: { _count: { select: { sales: true } } },
    orderBy: { createdAt: 'desc' },
  });
}
