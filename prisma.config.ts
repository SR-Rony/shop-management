import { config as loadEnv } from 'dotenv';
import { defineConfig, env } from 'prisma/config';

// Next.js uses .env.local for local development. Load the same file for the
// Prisma CLI, falling back to .env when .env.local is absent. Existing process
// environment variables take precedence because dotenv does not override them.
loadEnv({ path: ['.env.local', '.env'], quiet: true });

const databaseUrl = env('DATABASE_URL');

// Neon's pooled endpoint (-pooler in the hostname) is used by the application at
// runtime. Schema migrations need a direct (non-pooled) connection, so the CLI
// prefers DIRECT_URL when it is configured. A direct URL looks like the pooled
// URL with "-pooler" removed from the hostname.
const migrationUrl = process.env.DIRECT_URL?.trim() || databaseUrl;

export default defineConfig({
  schema: 'prisma/schema.prisma',
  migrations: {
    path: 'prisma/migrations',
    seed: 'tsx prisma/seed.ts',
  },
  datasource: {
    url: migrationUrl,
  },
});
