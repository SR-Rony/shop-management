# Local Development

1. Install Node.js 22.12+ and pnpm 10+.
2. Run `pnpm install`.
3. Copy `.env.example` to `.env.local` and fill local-only values. `DATABASE_URL` must be defined for Prisma CLI commands.
4. Run `pnpm dev`.
5. Run `pnpm lint`, `pnpm typecheck`, `pnpm test`, `pnpm format:check`, `pnpm build`, `pnpm db:validate` and `pnpm db:generate`.
6. Install the Playwright browser once with `pnpm exec playwright install chromium`, then run `pnpm test:e2e`.
7. Database work is not part of the initial foundation; use only a local development database when Phase 02 is approved.

The Prisma CLI loads `.env.local` first and falls back to `.env`. Existing process environment variables take precedence. Prisma generation writes to the git-ignored `src/generated/prisma` directory.

Never share `.env.local` or paste its values into chat.
