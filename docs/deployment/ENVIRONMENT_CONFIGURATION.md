# Environment Configuration

| Variable | Purpose | Example |
|---|---|---|
| `DATABASE_URL` | PostgreSQL connection for the current environment | local-only URL in `.env.local` |
| `AUTH_SECRET` | Secret used by the selected auth solution | generate a long random secret |
| `AUTH_URL` | Canonical app URL for auth callbacks | `http://localhost:3000` |
| `DEFAULT_CURRENCY` | Default currency | `BDT` |
| `DEFAULT_TIMEZONE` | Default display/business timezone | `Asia/Dhaka` |

Use placeholders only in `.env.example`. Never put real credentials in version control. Validate environment variables before using them in server code.
