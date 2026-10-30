# Authorization Policy (draft)

Proposed roles to discuss:
- Owner/Admin: configuration and broad business access.
- Manager: day-to-day oversight and approved reports.
- Cashier: sales/POS and permitted payment collection.
- Inventory staff: products and stock operations within assigned permissions.
- Accountant: finance, ledgers and reports.

Rules:
- Use permission-based server-side checks.
- Hiding a button is not authorization.
- High-risk actions (refunds, discounts, stock adjustments, user/permission changes) may require separate permissions or approval.
- Record actor, timestamp and reason for sensitive changes.
- Final role matrix must be approved by the owner before implementation.
