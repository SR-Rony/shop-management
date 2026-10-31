import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';

import { prisma } from '@/lib/db/prisma';
import { authConfig } from '@/lib/auth/config';
import { verifyPassword } from '@/lib/auth/password';
import { loginSchema } from '@/lib/validation/auth';

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      name: 'Phone and password',
      credentials: {
        phone: { label: 'Phone', type: 'tel' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        const parsed = loginSchema.safeParse(credentials);

        if (!parsed.success) {
          return null;
        }

        const user = await prisma.user.findUnique({
          where: { phone: parsed.data.phone },
        });

        if (!user || !user.isActive) {
          return null;
        }

        const passwordMatches = await verifyPassword(parsed.data.password, user.passwordHash);

        if (!passwordMatches) {
          return null;
        }

        // Only expose the fields needed to build the JWT/session. The password
        // hash must never leave the server boundary.
        return {
          id: user.id,
          name: user.name,
          role: user.role,
        };
      },
    }),
  ],
});
