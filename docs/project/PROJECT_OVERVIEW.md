# Project Overview

## Purpose
Create a reliable shop-management ERP for a retail shop in Bangladesh. The system should bring products, inventory, purchasing, suppliers, customers, POS sales, payments, dues, returns, finance and reporting into one auditable application.

## Initial context
- Initial deployment target: one shop.
- Default currency: BDT (configurable).
- Default timezone: Asia/Dhaka (configurable).
- Users: owner/admin and employees with role-based permissions.
- Architecture: Next.js modular monolith; no separate NestJS/Express backend initially.
- Database: PostgreSQL through Prisma.

## User outcomes
- Know current stock and stock history.
- Record sales and distinguish invoice totals from money received.
- Track customer receivables and supplier payables.
- Preserve historical financial records.
- Review sales, purchase, expense and inventory reports.
- Expand later without coupling business rules to the UI.

## Current status
This repository contains the initial foundation only. ERP business modules are not implemented.
