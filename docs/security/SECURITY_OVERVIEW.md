# Security Overview

Security requirements for future phases:

- Validate all untrusted input on the server.
- Enforce authorization on every protected operation, not just in the UI.
- Store secrets in environment variables/secret manager; never commit them.
- Use secure session and password handling from a maintained authentication solution.
- Apply least-privilege permissions.
- Avoid leaking stack traces, secrets or personal data in user-facing errors/logs.
- Audit important financial and administrative changes.
- Rate-limit sensitive public endpoints where applicable.
- Review dependencies and keep them patched.
- Test backup restoration and incident recovery before production.
