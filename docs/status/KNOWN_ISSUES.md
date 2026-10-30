# Known Issues and Unverified Items

## Current known gaps

- Authentication and server-side authorization are not implemented.
- Environment variable validation is not yet wired into application startup.
- The Prisma schema contains no ERP models; Phase 02 must design and review them.
- No database migration has been created or run.
- Generated Prisma Client output under `src/generated/prisma` is not committed. Run `pnpm db:generate` after a clean install or schema change.
- Prisma CLI commands require `DATABASE_URL`. The config loads `.env.local` first and falls back to `.env`; existing process environment variables take precedence.
- shadcn/ui is not initialized; add components when the approved phase requires them.
- No CI pipeline currently enforces lint, typecheck, tests, formatting, build or Prisma checks.
- Playwright requires `pnpm exec playwright install chromium` on a fresh machine before `pnpm test:e2e`.
- Next.js regenerates `next-env.d.ts` with dev/build-specific type imports. It is excluded from Prettier; review and discard generated-only changes before committing.
- The project uses version ranges in `package.json`; the committed lockfile pins current versions, but compatibility should still be reviewed before release.
- pnpm reports `eslint@9.39.5` as no longer supported. An ESLint upgrade is deferred until compatibility with the installed Next.js config is reviewed.
- No security headers, CSP, rate limiting or production audit logging are configured yet.
- Accounting, VAT/tax, inventory costing, invoice numbering and double-entry assumptions require owner/accountant review.
