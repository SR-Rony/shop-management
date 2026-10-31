import type { NextAuthConfig } from 'next-auth';

import type { Role } from '@/generated/prisma/client';

/**
 * Configuration shared by the full Auth.js instance (`src/auth.ts`) and the
 * lightweight Proxy instance. Keep database/bcrypt access out of this module
 * so `src/proxy.ts` can decode the session cookie without bundling Prisma.
 */
export const authConfig = {
  pages: {
    signIn: '/login',
  },
  session: {
    strategy: 'jwt',
    // A shop shift is typically shorter than a day; require a fresh login
    // after eight hours of inactivity.
    maxAge: 8 * 60 * 60,
    updateAge: 60 * 60,
  },
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }

      return token;
    },
    session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as Role;
      }

      return session;
    },
  },
  providers: [],
} satisfies NextAuthConfig;
