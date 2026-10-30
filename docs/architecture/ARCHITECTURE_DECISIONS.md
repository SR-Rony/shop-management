# Architecture Decisions (proposed)

## ADR-001: Modular monolith
**Status:** Proposed. Keep one Next.js application initially; do not create a separate NestJS/Express backend unless requirements justify it.

## ADR-002: Money arithmetic
**Status:** Proposed. PostgreSQL `NUMERIC` and Decimal.js; never use JavaScript float math for financial calculations. Accountant must approve scale and rounding.

## ADR-003: Inventory ledger
**Status:** Proposed. Append-only stock movement records with transactional balance updates. Define reconciliation and locking before implementing stock operations.

## ADR-004: Posted document immutability
**Status:** Proposed. Posted invoices, payments and journal entries are not silently edited/deleted; corrections use traceable reversals/credit documents.

## ADR-005: Authentication
**Status:** Pending research and approval. Compare maintained libraries against installed Next.js compatibility before selecting.

## ADR-006: Prisma conventions
**Status:** Proposed to use current Prisma configuration conventions. Verify official docs and package versions before migrations or production use.

## ADR-007: Invoice numbering
**Status:** Proposed. Unique, transaction-safe number allocation; future branch/fiscal-year sequence is possible.

## ADR-008: Accounting model
**Status:** Pending accountant approval. Decide whether full double-entry accounting is required in the first release.
