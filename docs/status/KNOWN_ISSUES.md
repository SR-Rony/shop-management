# Known Issues and Unverified Items

- This archive has not been installed or executed in the user's environment.
- No `pnpm-lock.yaml` is included; create it with `pnpm install` after reviewing package versions.
- Authentication is not implemented.
- Environment variable validation is not yet wired into application startup.
- Prisma schema contains no ERP models; Phase 02 must design and review them.
- No database migration has been created or run.
- shadcn/ui is not initialized; add components when the approved phase requires them.
- The project uses version ranges; verify compatibility and resolve a lockfile before release.
- Accounting, VAT/tax, inventory costing and invoice numbering assumptions require owner/accountant review.
