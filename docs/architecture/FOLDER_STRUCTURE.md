# Folder Structure

```text
src/
  app/                  # Next.js routes, layouts, thin server adapters
  components/
    ui/                 # Shared UI primitives; add as used
    shared/             # Shared presentation components
  modules/
    products/           # Phase 04
    inventory/          # Phase 04
    suppliers/           # Phase 05
    purchases/           # Phase 05
    customers/           # Phase 06
    sales/               # Phase 07
    payments/            # Phase 08
    returns/             # Phase 09
    accounting/          # Phase 10
    reports/             # Phase 11
    auth/                # Phase 03
  lib/
    money/               # Decimal-safe helpers
    env/                 # Environment validation (expand before secrets are used)
    dates/               # Timezone/date helpers when required
    errors/              # Typed application errors when introduced
  server/
    db/                  # Prisma client/repositories, server-only
    auth/                # Session and permission helpers
prisma/
  schema.prisma          # Phase 02 owns actual ERP schema
  migrations/            # Reviewed migrations
docs/
tests/
```

Only create module directories when they contain meaningful files. Do not create empty placeholders. The current starter may not yet contain every path listed above.
