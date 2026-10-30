# Future Backend Extraction

Do not create a separate backend for the initial release. Keep application use-cases and domain rules independent of Next.js and React.

If later justified by mobile apps, partner integrations, scaling or separate deployment needs:

1. Identify stable use-case interfaces and transport contracts.
2. Move API adapters to a dedicated service without moving domain policy into controllers.
3. Reuse shared domain/application packages where appropriate.
4. Add API authentication, rate limits, observability and contract tests.
5. Migrate incrementally; do not duplicate business logic between web and API.
