# Phase 07 — Sales and POS (planned)

## Objective
Support quick in-store sales and traceable invoices.

## Prerequisites
Products/inventory, customers, database and auth verified; invoice numbering policy approved.

## Scope
POS flow, sale and line items, price snapshots, discounts under permission policy, stock deduction, invoice rendering and transaction-safe invoice numbering.

## Acceptance
Concurrent sales cannot oversell; totals reconcile; price history is preserved; invoices are unique; tests cover failure rollback.
