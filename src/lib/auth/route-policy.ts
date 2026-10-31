import { Role } from '@/generated/prisma/enums';

const PUBLIC_API_PREFIXES = ['/api/auth', '/api/health'] as const;
const ADMIN_API_PREFIXES = ['/api/users'] as const;
const PROTECTED_PAGE_PREFIXES = ['/dashboard', '/products', '/customers', '/sales'] as const;

export interface SessionUser {
  role: Role;
}

export type RouteAccess =
  | { type: 'allow' }
  | { type: 'unauthorized' }
  | { type: 'forbidden' }
  | { type: 'login'; callbackUrl: string };

function matchesPrefix(pathname: string, prefix: string): boolean {
  return pathname === prefix || pathname.startsWith(`${prefix}/`);
}

/**
 * Pure route policy shared by Proxy and unit tests.
 *
 * - Public: `/`, `/login`, `/api/auth/*` and `/api/health`.
 * - Protected pages: `/dashboard`, `/products`, `/customers`, `/sales`.
 * - Protected APIs: every `/api/*` route not listed as public.
 * - Admin-only APIs: `/api/users`.
 */
export function decideRouteAccess(pathname: string, user: SessionUser | null): RouteAccess {
  if (matchesPrefix(pathname, '/api')) {
    if (PUBLIC_API_PREFIXES.some((prefix) => matchesPrefix(pathname, prefix))) {
      return { type: 'allow' };
    }

    if (!user) {
      return { type: 'unauthorized' };
    }

    if (
      ADMIN_API_PREFIXES.some((prefix) => matchesPrefix(pathname, prefix)) &&
      user.role !== Role.ADMIN
    ) {
      return { type: 'forbidden' };
    }

    return { type: 'allow' };
  }

  if (PROTECTED_PAGE_PREFIXES.some((prefix) => matchesPrefix(pathname, prefix)) && !user) {
    return { type: 'login', callbackUrl: pathname };
  }

  return { type: 'allow' };
}
