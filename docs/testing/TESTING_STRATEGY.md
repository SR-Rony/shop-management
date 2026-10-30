# Testing Strategy

- Unit tests: money rounding, stock rules, invoice number policy, domain calculations.
- Integration tests: repository/database transactions, payment allocations, returns and posting.
- Authorization tests: role/permission matrix, direct API access and cross-scope access.
- Concurrency tests: two sales competing for limited stock, unique invoice number allocation.
- E2E tests: login, purchase, sale, partial payment, due collection, return and reporting.
- Financial invariants: totals reconcile, balances do not drift, posted journals balance.
- Use isolated local/test databases only. Never reset or seed a production database.
- Every phase must state which tests ran and which remain unverified.
