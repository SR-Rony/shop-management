# OpenCode Prompt — Phase 02 Database

Read `AGENTS.md`, Phase 02 spec, `DATABASE_DESIGN.md`, `DATABASE_ERD.md`, `DATA_INTEGRITY_RULES.md`, `INVENTORY_COSTING.md`, `INVOICE_NUMBERING.md`, assumptions register and current status.

Before editing:

1. Inspect actual code and Git status. Stop if there are uncommitted changes or scope conflicts.
2. Confirm owner/accountant decisions are recorded. If key accounting or stock decisions remain unresolved, ask instead of guessing.
3. Propose the exact schema/migration diff before applying it.

Implementation rules:

- Use only the local development database.
- Never reset/drop any database or use production credentials.
- Preserve money as Decimal/NUMERIC, historical prices/costs and document auditability.
- Define transaction boundaries and constraints explicitly.
- Run Prisma validation/generation and relevant tests; state what was not run.
- Review diff and update status/changelog/known issues.
- Stop before Phase 03.
