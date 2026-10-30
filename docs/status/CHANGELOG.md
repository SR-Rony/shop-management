# Changelog

## Unreleased — Phase 01 verification (2026-10-30)

- Formatted the repository with Prettier and excluded Next.js-generated and generated Prisma artifacts.
- Added `dotenv` as a direct dependency; Prisma now loads `.env.local` and falls back to `.env`.
- Verified `prisma validate` and `prisma generate` locally.
- Raised the Node.js engine requirement to `>=22.12.0`, added a pnpm engine requirement and approved only the required dependency build scripts.
- Hardened the money helper to reject JavaScript number inputs and invalid decimal-place counts; added tests.
- Updated status, deployment and setup documentation to reflect verified local results.

## 0.1.0 — Initial starter archive

- Added Next.js App Router foundation and a simple landing page.
- Added strict TypeScript, Tailwind, lint/format and test configuration.
- Added Prisma 7-style configuration placeholder without ERP models or migrations.
- Added Decimal.js helper with unit tests.
- Added project architecture, scope, security, database, roadmap and status documentation.
