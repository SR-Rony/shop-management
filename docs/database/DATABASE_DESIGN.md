# Database Design

The Phase 02 foundation is implemented in `prisma/schema.prisma` and the `init_erp_foundation` migration. The candidate entities below remain the design backlog for later phases; they are not all implemented yet.

## Candidate entities

- Organization/Shop and future Branch (scope to confirm).
- User, Role, Permission and role/permission assignments.
- Product, Category, Unit and optional product identifiers.
- StockMovement and optionally a transactional stock balance.
- Supplier, Purchase, PurchaseLine, SupplierPayment and allocation.
- Customer, Sale, SaleLine, CustomerPayment and allocation.
- SalesReturn, PurchaseReturn, Refund/credit adjustment.
- Expense, Cash/Bank account and ledger entries.
- JournalEntry/JournalLine if double-entry accounting is approved.
- AuditLog and configuration.

## Design requirements

- Foreign keys and appropriate unique constraints.
- Decimal database types for amounts.
- Explicit document states and timestamps.
- Transactional consistency across stock, payments and documents.
- Historical product prices/costs stored on transaction lines.
- Tenant/branch scoping only after requirements are confirmed.
- Avoid implementing models from this list without reviewing the ERD and migrations.
