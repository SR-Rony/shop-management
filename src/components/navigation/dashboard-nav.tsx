'use client';

import Link from 'next/link';
import type { Route } from 'next';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import {
  Package,
  Users,
  Receipt,
  PlusCircle,
  Menu,
  X,
  Store,
  Home,
  CheckCircle2,
} from 'lucide-react';

interface NavigationItem {
  name: string;
  href: Route;
  icon: React.ComponentType<{ className?: string }>;
  exact?: boolean;
}

const navigationItems: NavigationItem[] = [
  {
    name: 'Overview',
    href: '/',
    icon: Home,
    exact: true,
  },
  {
    name: 'Products',
    href: '/products',
    icon: Package,
  },
  {
    name: 'Customers',
    href: '/customers',
    icon: Users,
  },
  {
    name: 'Sales',
    href: '/sales',
    icon: Receipt,
  },
];

export function DashboardNav() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isActive = (href: string, exact = false) => {
    if (exact) {
      return pathname === href;
    }
    return pathname === href || pathname.startsWith(`${href}/`);
  };

  return (
    <>
      {/* Mobile Top Bar */}
      <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-slate-200 bg-white px-4 md:hidden">
        <div className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-teal-700 text-white">
            <Store className="h-5 w-5" />
          </div>
          <div>
            <span className="font-bold text-slate-900">Shop ERP</span>
            <span className="ml-1 text-xs text-teal-700 font-medium">Retail</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/sales/new"
            className="flex items-center gap-1 rounded-lg bg-teal-700 px-3 py-1.5 text-xs font-semibold text-white hover:bg-teal-800"
          >
            <PlusCircle className="h-3.5 w-3.5" />
            <span>New Sale</span>
          </Link>
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="rounded-lg p-2 text-slate-600 hover:bg-slate-100"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </header>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="border-b border-slate-200 bg-white px-4 py-3 md:hidden">
          <nav className="flex flex-col gap-1">
            {navigationItems.map((item) => {
              const active = isActive(item.href, item.exact);
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                    active
                      ? 'bg-teal-50 text-teal-800 font-semibold'
                      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                  }`}
                >
                  <Icon className={`h-4 w-4 ${active ? 'text-teal-700' : 'text-slate-400'}`} />
                  <span>{item.name}</span>
                </Link>
              );
            })}
            <Link
              href="/sales/new"
              onClick={() => setMobileMenuOpen(false)}
              className="mt-2 flex items-center justify-center gap-2 rounded-lg bg-teal-700 px-4 py-2 text-sm font-semibold text-white hover:bg-teal-800"
            >
              <PlusCircle className="h-4 w-4" />
              <span>Create New Sale</span>
            </Link>
          </nav>
        </div>
      )}

      {/* Desktop Sidebar */}
      <aside className="hidden w-64 shrink-0 border-r border-slate-200 bg-white md:flex md:flex-col md:min-h-screen">
        {/* Brand */}
        <div className="flex h-16 items-center gap-3 border-b border-slate-200 px-6">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-700 text-white shadow-sm">
            <Store className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-base font-bold leading-none text-slate-900">Shop ERP</h1>
            <p className="mt-1 text-xs text-slate-500">Retail Management</p>
          </div>
        </div>

        {/* Quick action button */}
        <div className="p-4">
          <Link
            href="/sales/new"
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-teal-700 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-teal-800"
          >
            <PlusCircle className="h-4 w-4" />
            <span>Create Sale</span>
          </Link>
        </div>

        {/* Navigation */}
        <div className="flex-1 px-3 py-2">
          <div className="mb-2 px-3 text-xs font-semibold uppercase tracking-wider text-slate-400">
            Main Menu
          </div>
          <nav className="flex flex-col gap-1">
            {navigationItems.map((item) => {
              const active = isActive(item.href, item.exact);
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                    active
                      ? 'bg-teal-50 text-teal-800 font-semibold'
                      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                  }`}
                >
                  <Icon className={`h-4 w-4 ${active ? 'text-teal-700' : 'text-slate-400'}`} />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* System info badge */}
        <div className="border-t border-slate-200 p-4">
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
            <div className="flex items-center justify-between text-xs text-slate-600">
              <span className="font-medium text-slate-700">Currency</span>
              <span className="rounded bg-teal-100 px-1.5 py-0.5 font-bold text-teal-800">BDT</span>
            </div>
            <div className="mt-2 flex items-center justify-between text-xs text-slate-600">
              <span className="font-medium text-slate-700">Timezone</span>
              <span className="text-slate-600">Asia/Dhaka</span>
            </div>
            <div className="mt-2.5 flex items-center gap-1.5 text-xs text-emerald-700">
              <CheckCircle2 className="h-3.5 w-3.5" />
              <span>System Online</span>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
