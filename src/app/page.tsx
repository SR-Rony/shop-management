import Link from 'next/link';
import type { Route } from 'next';
import {
  Package,
  Users,
  Receipt,
  PlusCircle,
  ArrowRight,
  UserCog,
  LogIn,
  Shield,
} from 'lucide-react';
import { auth } from '@/auth';

interface ActiveModule {
  title: string;
  description: string;
  href: Route;
  icon: React.ComponentType<{ className?: string }>;
  badge: string;
}

const baseActiveModules: ActiveModule[] = [
  {
    title: 'Products Catalogue',
    description: 'Browse catalogue products, inventory stock levels, SKUs, and categories.',
    href: '/products',
    icon: Package,
    badge: 'Active',
  },
  {
    title: 'Customers Directory',
    description: 'View customer accounts, phone contacts, email addresses, and sales count.',
    href: '/customers',
    icon: Users,
    badge: 'Active',
  },
  {
    title: 'Sales & Invoices',
    description: 'Track orders, total amounts, paid allocations, payment status, and dates.',
    href: '/sales',
    icon: Receipt,
    badge: 'Active',
  },
  {
    title: 'Create POS Sale',
    description: 'Record new customer sales, add multiple line items, and post invoices.',
    href: '/sales/new',
    icon: PlusCircle,
    badge: 'Form',
  },
];

const plannedModules = [
  [
    'Products & Inventory',
    'Product catalogue, stock levels, movement history and low-stock alerts.',
  ],
  ['Purchases & Suppliers', 'Purchase records, supplier balances and supplier payment history.'],
  ['Customers & Sales POS', 'Customer profiles, quick sales, invoices, partial payments and dues.'],
  ['Returns & Refunds', 'Traceable sales returns, purchase returns and refund adjustments.'],
  [
    'Finance & Reports',
    'Income and expenses, cash/bank records, receivables, payables and reports.',
  ],
  ['Users & Permissions', 'Role-based access for the owner, cashier and other staff.'],
];

export default async function HomePage() {
  const session = await auth();

  const activeModules = [...baseActiveModules];
  if (session?.user?.role === 'ADMIN') {
    activeModules.push({
      title: 'User Management',
      description: 'Manage staff credentials, role-based permissions, and user accounts.',
      href: '/users' as Route,
      icon: UserCog,
      badge: 'Admin',
    });
  }

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-6xl flex-col px-6 py-10 md:px-10">
      <header className="flex flex-col gap-4 border-b border-slate-200 pb-8 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-teal-700">
            Project Foundation
          </p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900 md:text-5xl">
            Shop Management ERP
          </h1>
          <p className="mt-3 max-w-2xl text-base leading-7 text-slate-600">
            A workspace for managing retail products, stock, customers, sales and financial records.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          {session?.user ? (
            <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs shadow-sm">
              <span className="font-semibold text-slate-900">{session.user.name}</span>
              <span className="inline-flex items-center gap-1 rounded bg-teal-100 px-2 py-0.5 font-bold text-teal-800">
                <Shield className="h-3 w-3" />
                {session.user.role}
              </span>
            </div>
          ) : (
            <Link
              href="/login"
              className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 shadow-sm hover:bg-slate-50 transition"
            >
              <LogIn className="h-3.5 w-3.5" />
              <span>Sign in</span>
            </Link>
          )}

          <Link
            href="/sales/new"
            className="inline-flex items-center gap-2 rounded-xl bg-teal-700 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-teal-800 transition"
          >
            <PlusCircle className="h-4 w-4" />
            <span>Create Sale</span>
          </Link>
          <span className="w-fit rounded-full border border-amber-300 bg-amber-50 px-4 py-2 text-sm font-semibold text-amber-800">
            Foundation only
          </span>
        </div>
      </header>

      {/* Quick Access to Active Pages */}
      <section className="py-8">
        <div className="mb-4 flex items-end justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-slate-900">ERP Navigation</h2>
            <p className="mt-1 text-sm text-slate-500">
              Access the implemented frontend pages and POS workflow.
            </p>
          </div>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {activeModules.map((module) => {
            const Icon = module.icon;
            return (
              <Link
                key={module.href}
                href={module.href}
                className="group flex flex-col justify-between rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-teal-400 hover:shadow-md"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-teal-50 text-teal-700 group-hover:bg-teal-700 group-hover:text-white transition">
                      <Icon className="h-5 w-5" />
                    </div>
                    <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-semibold text-slate-600">
                      {module.badge}
                    </span>
                  </div>
                  <h3 className="mt-4 font-bold text-slate-900 group-hover:text-teal-700 transition">
                    {module.title}
                  </h3>
                  <p className="mt-1.5 text-xs leading-5 text-slate-500">{module.description}</p>
                </div>
                <div className="mt-4 flex items-center gap-1 text-xs font-semibold text-teal-700 group-hover:translate-x-1 transition-transform">
                  <span>Open page</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      <section className="pb-8">
        <div className="rounded-2xl border border-teal-100 bg-white p-6 shadow-sm md:p-8">
          <h2 className="text-xl font-bold text-slate-900">System Foundation</h2>
          <p className="mt-2 max-w-3xl leading-7 text-slate-600">
            This starter project establishes the application shell and engineering conventions.
          </p>
          <div className="mt-5 grid gap-3 sm:grid-cols-3">
            <div className="rounded-xl bg-slate-50 p-4">
              <p className="text-sm text-slate-500">Default currency</p>
              <p className="mt-1 text-lg font-bold">BDT (৳)</p>
            </div>
            <div className="rounded-xl bg-slate-50 p-4">
              <p className="text-sm text-slate-500">Default timezone</p>
              <p className="mt-1 text-lg font-bold">Asia/Dhaka</p>
            </div>
            <div className="rounded-xl bg-slate-50 p-4">
              <p className="text-sm text-slate-500">Architecture</p>
              <p className="mt-1 text-lg font-bold">Modular monolith</p>
            </div>
          </div>
        </div>
      </section>

      <section className="pb-10">
        <div className="mb-4 flex items-end justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">Planned modules</h2>
            <p className="mt-1 text-sm text-slate-500">For planning and roadmap reference.</p>
          </div>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {plannedModules.map(([title, description]) => (
            <article
              key={title}
              className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
            >
              <h3 className="font-bold text-slate-900">{title}</h3>
              <p className="mt-2 text-sm leading-6 text-slate-600">{description}</p>
            </article>
          ))}
        </div>
      </section>

      <footer className="mt-auto border-t border-slate-200 pt-5 text-sm text-slate-500">
        Development foundation • Review documentation before implementing each phase.
      </footer>
    </main>
  );
}
