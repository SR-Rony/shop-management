import 'server-only';

import { auth } from '@/auth';
import type { Role } from '@/generated/prisma/client';
import { ForbiddenError, UnauthorizedError } from '@/lib/errors/app-error';

export interface AuthenticatedUser {
  id: string;
  name?: string | null;
  role: Role;
}

/**
 * Server-side authentication guard for Route Handlers, Server Actions and
 * other server code. Proxy/middleware checks are optimistic only; every
 * protected operation must also authorize here or in its use-case.
 */
export async function requireUser(): Promise<AuthenticatedUser> {
  const session = await auth();

  if (!session?.user?.id || !session.user.role) {
    throw new UnauthorizedError();
  }

  return {
    id: session.user.id,
    name: session.user.name,
    role: session.user.role,
  };
}

export async function requireRole(...roles: Role[]): Promise<AuthenticatedUser> {
  const user = await requireUser();

  if (!roles.includes(user.role)) {
    throw new ForbiddenError();
  }

  return user;
}
