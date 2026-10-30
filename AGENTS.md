# Instructions for coding agents

## Start here

1. Read `README.md`.
2. Read `docs/project/PROJECT_OVERVIEW.md`.
3. Read `docs/architecture/SYSTEM_ARCHITECTURE.md`.
4. Read `docs/database/DATA_INTEGRITY_RULES.md`.
5. Read the relevant phase specification and current `docs/status/IMPLEMENTATION_STATUS.md`.
6. Inspect the actual code and run `git status --short` before editing.

## Architecture boundaries

- Modular monolith; no separate NestJS/Express service in the initial architecture.
- Keep business logic independent from React/Next.js adapters.
- UI/presentation must never import Prisma.
- Server adapters validate with Zod, authorize server-side, invoke a use-case and map the result.
- Use `server-only` in server-only modules.
- Add folders only when they contain meaningful files.

## Financial and inventory rules

- Use Decimal for money; never use JavaScript float math.
- A sale is not the same event as receiving payment. A purchase is not the same event as paying a supplier.
- Dues and payables must be derived from posted documents and allocated payments.
- Preserve historical prices/costs.
- Posted documents are immutable; corrections require traceable reversals/credit documents.
- Stock is recorded through a movement ledger; prevent overselling with a documented transaction/locking strategy.
- Accounting and tax policies require owner/accountant review.

## Safety

- Never delete user files, overwrite uncommitted changes, reset Git history, force-push, or run destructive database commands.
- Never read or print `.env` values or commit secrets.
- Do not run migrations against production.
- Do not claim a test/build/install passed unless it was actually run and its result observed.
- Do not start the next phase until the current phase has been reviewed and approved.

## Definition of done

- Scope and acceptance criteria are met.
- Relevant tests are meaningful and pass.
- Lint, typecheck, format checks and build are run where possible.
- Documentation/status/changelog are updated.
- `git diff` is reviewed and unverified items are listed.

<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
