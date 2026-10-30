import 'server-only';

import { prisma } from '@/lib/db/prisma';

export async function checkDatabaseHealth() {
  const startedAt = Date.now();

  await prisma.$queryRaw`SELECT 1`;

  return {
    status: 'ok',
    database: 'ok',
    latencyMs: Date.now() - startedAt,
    timestamp: new Date().toISOString(),
  };
}
