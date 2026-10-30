# শুরু করার নির্দেশনা (বাংলা)

## ১. ZIP extract করুন
ZIP ফাইলটি extract করে `shop-management-erp` ফোল্ডারটি OpenCode-এ খুলুন।

## ২. আগে ডকুমেন্ট পড়ুন
- `README.md`
- `AGENTS.md`
- `docs/project/PROJECT_OVERVIEW.md`
- `docs/roadmap/DEVELOPMENT_ROADMAP.md`

## ৩. প্রয়োজনীয় সফটওয়্যার
- Node.js 22 বা তার পরের compatible version
- pnpm 10 বা compatible version
- PostgreSQL (ডেটাবেস phase শুরু হলে)

## ৪. Terminal command
প্রজেক্ট ফোল্ডারের ভিতরে চালান:

```bash
pnpm install
cp .env.example .env.local
pnpm dev
```

`.env.local` ফাইলের placeholder মান নিজের local development environment অনুযায়ী পূরণ করুন। আসল secret কাউকে পাঠাবেন না এবং Git-এ commit করবেন না।

তারপর ব্রাউজারে `http://localhost:3000` খুলুন।

## ৫. প্রাথমিক পরীক্ষা
```bash
pnpm lint
pnpm typecheck
pnpm test
pnpm format:check
pnpm build
```

Prisma configuration-এর জন্য dependencies install করার পর:
```bash
pnpm exec prisma validate
pnpm exec prisma generate
```

## গুরুত্বপূর্ণ
এটি একটি starter foundation, সম্পূর্ণ ERP নয়। Login, products, stock, sales, customers, accounting ইত্যাদি এখনো implement করা হয়নি। প্রথমে setup/check চালিয়ে ফলাফল দেখুন, তারপর `docs/roadmap/opencode-prompts/` থেকে একবারে একটি phase-এর prompt ব্যবহার করুন। Production database-এ migration বা destructive command চালাবেন না।
