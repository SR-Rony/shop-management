# Invoice Numbering

Requirements:

- Unique invoice identifiers; concurrent sales must not receive duplicate numbers.
- Number allocation must be transactional.
- Do not use a simple row count as the number generator.
- Document whether cancelled invoices leave gaps and how corrections are represented.
- Future branch/fiscal-year sequences may be supported, but exact policy needs owner/accountant approval.
- Preserve invoice references in reports, returns, receipts and audit history.
