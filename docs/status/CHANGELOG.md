# Changelog

## Unreleased — Phase 02 database and API foundation (2026-10-30)

- Added the initial ERP Prisma schema: categories, products, customers, suppliers, sales, sale items, payments, inventory movements and invoice sequences.
- Added the `init_erp_foundation` migration and an idempotent development seed.
- Added a singleton Prisma client using the `pg` driver adapter and the pooled runtime `DATABASE_URL`.
- Added `DIRECT_URL` support for Neon migrations while keeping `DATABASE_URL` for application queries.
- Added Decimal-safe sale creation with transactional stock decrements, insufficient-stock protection, invoice number allocation and inventory ledger entries.
- Added JSON Route Handlers for health, products, categories, customers and sales.
- Added Zod sale-contract tests for quantities, payment amounts and defaults.
- Added `tsx` for the Prisma seed command.

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
