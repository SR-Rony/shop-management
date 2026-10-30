# Local Development

1. Install Node.js 22+ and pnpm 10+.
2. Run `pnpm install`.
3. Copy `.env.example` to `.env.local` and fill local-only values.
4. Run `pnpm dev`.
5. Run `pnpm lint`, `pnpm typecheck`, `pnpm test`, `pnpm format:check` and `pnpm build`.
6. Database work is not part of the initial foundation; use only a local development database when Phase 02 is approved.

Never share `.env.local` or paste its values into chat.
