# Phase 04 — Products and Inventory (planned)

## Objective
Build product catalogue and auditable inventory movement.

## Prerequisites
Database and auth/RBAC verified; inventory costing and negative-stock policy approved.

## Scope
Products, categories, units as needed, stock movement ledger, controlled adjustments, low-stock warnings, costing calculations and concurrency-safe stock updates.

## Acceptance
Stock movements reconcile, negative stock is blocked by default, concurrent sales cannot oversell, historical cost is preserved, and unit/integration tests cover key rules.
