# Data Integrity Rules

1. A sale is not the same event as receiving cash. A purchase is not the same event as paying a supplier.
2. Receivables/payables derive from posted documents and allocated payments.
3. Never use floating-point arithmetic for money; use NUMERIC/Decimal with approved scale and rounding.
4. Historical invoice prices and costs must not change when current product prices change.
5. Posted documents are immutable; corrections use linked reversal/credit documents.
6. Returns should link to the original transaction where applicable.
7. Stock is represented by a movement ledger; negative stock is blocked unless an approved setting allows it.
8. Concurrent sales must not oversell; define transaction/locking strategy.
9. Every posted journal balances (debits = credits) if double-entry accounting is enabled.
10. Important changes must be attributable to a user where appropriate.
11. Never claim accounting or tax compliance without professional review.
