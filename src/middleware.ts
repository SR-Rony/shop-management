import { type NextRequest, NextResponse } from 'next/server';
import NextAuth from 'next-auth';

// Import the route policy that encapsulates the access rules
import { decideRouteAccess, SessionUser } from '@/lib/auth/route-policy';

// Lightweight Auth.js configuration safe for Edge Runtime (no Prisma or bcrypt)
import { authConfig } from '@/lib/auth/config';

const { auth } = NextAuth(authConfig);

export const config = {
  // Run on all routes except Next.js internals and static assets
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|robots.txt).*)'],
};

export async function middleware(request: NextRequest) {
  // Skip middleware for API routes — authorization is enforced in route handlers
  if (request.nextUrl.pathname.startsWith('/api')) {
    return NextResponse.next();
  }

  // Authenticate the session via Auth.js v5
  const session = await auth();

  // Build the session user profile; null when not logged in
  const user: SessionUser | null = session?.user
    ? {
        role: session.user.role,
      }
    : null;

  // Determine what access this route should have
  const access = decideRouteAccess(request.nextUrl.pathname, user);

  switch (access.type) {
    case 'allow':
      // Authorized — let the request proceed
      return NextResponse.next();

    case 'login':
    case 'unauthorized': {
      // Not logged in and trying to access a protected page
      // Redirect to login, preserving the original destination as a query param
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('redirectTo', request.nextUrl.pathname);
      return NextResponse.redirect(loginUrl);
    }

    case 'forbidden':
      // Logged in but insufficient role (e.g. non-admin on /api/users)
      return NextResponse.json(
        { success: false, error: 'Forbidden: insufficient permissions.' },
        { status: 403 }
      );

    default:
      return NextResponse.next();
  }
}
