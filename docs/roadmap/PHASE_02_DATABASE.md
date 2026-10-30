# Phase 02 — Database Design

## Objective
Approve and implement the first real ERP database schema.

## Prerequisites
Phase 01 verified; owner confirms core assumptions; accountant reviews costing/accounting choices.

## Scope
- Review candidate entities and ERD.
- Define keys, constraints, monetary precision, document states, auditability and transaction boundaries.
- Create reviewed Prisma models and migrations for a local development database only.
- Add schema validation and repository-level tests where possible.

## Out of scope
Auth implementation, POS UI, production migrations and unapproved accounting policy.

## Acceptance
- ERD and schema agree.
- Migration diff is reviewed.
- Prisma validate/generate and tests pass.
- No production database is touched.
