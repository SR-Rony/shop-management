import { config as loadEnv } from 'dotenv';
import { defineConfig, env } from 'prisma/config';

// Next.js uses .env.local for local development. Load the same file for the
// Prisma CLI, falling back to .env when .env.local is absent. Existing process
// environment variables take precedence because dotenv does not override them.
loadEnv({ path: ['.env.local', '.env'], quiet: true });

export default defineConfig({
  schema: 'prisma/schema.prisma',
  migrations: {
    path: 'prisma/migrations',
  },
  datasource: {
    url: env('DATABASE_URL'),
  },
});
