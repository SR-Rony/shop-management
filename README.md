# Shop Management ERP

A modular monolith foundation for a retail shop management system intended initially for one shop in Bangladesh.

> **Important:** This repository is a starter foundation. Products, inventory transactions, customers, POS, accounting, authentication and other ERP business features are planned, not implemented.

## Stack

- Next.js App Router + React + strict TypeScript
- PostgreSQL + Prisma ORM
- Tailwind CSS
- Zod (validation foundation; add schemas alongside each module)
- Decimal.js for decimal-safe financial arithmetic
- Vitest and Playwright
- pnpm

Dependency versions use major-version ranges in `package.json`. Review the lockfile and official compatibility notes before production use.

## Requirements

- Node.js 22+
- pnpm 10+
- PostgreSQL for database-backed phases

## Setup

```bash
pnpm install
cp .env.example .env.local
# Edit .env.local locally. Never commit real secrets.
pnpm dev
```

Open `http://localhost:3000`.

## Verification

```bash
pnpm lint
pnpm typecheck
pnpm test
pnpm format:check
pnpm build
pnpm exec prisma validate
pnpm exec prisma generate
```

Prisma generation/validation may require dependencies to be installed first. No database migration is included in this foundation. Do not run migrations against a production database.

## Project rules

1. Read `AGENTS.md` and the relevant `docs/` files before each development phase.
2. UI components must not import Prisma or access the database directly.
3. Route Handlers and Server Actions should validate input, authorize the action and call application use-cases.
4. Never use JavaScript floating-point arithmetic for money.
5. Posted financial documents must be corrected through traceable reversal/adjustment documents, not silently overwritten.
6. Stock movements and payment allocations must preserve history.
7. Do not run destructive Git or database commands without explicit approval.
8. Never commit `.env` files, credentials or real customer data.

## Roadmap

See `docs/roadmap/DEVELOPMENT_ROADMAP.md`. Implement one approved phase at a time.
# shop-management
