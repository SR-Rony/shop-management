# System Architecture

## Style

Use a modular monolith. Next.js provides the web UI and server-side adapters. Business rules should be independent of UI components so a future API service can reuse them.

## Logical layers

- Presentation: `src/app`, shared UI components.
- Application: use-cases and orchestration inside `src/modules/<module>/application`.
- Domain: domain types, policies and pure business rules.
- Infrastructure: Prisma repositories and external services.
- Contracts: Zod schemas and typed input/output contracts.
- Security: authentication and server-side authorization.

## Dependency direction

Presentation -> application -> domain.
Infrastructure implements application/domain-facing ports. Domain must not depend on Next.js, React or Prisma. UI must never import Prisma.

## Server request flow

Validate input -> authenticate -> authorize -> invoke use-case -> persist transactionally -> map safe result -> respond.

## Cross-cutting concerns

- `server-only` for server-only modules.
- Centralized error mapping and structured logging.
- Decimal-safe money arithmetic.
- Transaction boundaries for sales, payments and inventory.
- Tests for invariants, authorization and concurrency.

## Current status

This document describes the target architecture. The ERP modules are not implemented yet.
